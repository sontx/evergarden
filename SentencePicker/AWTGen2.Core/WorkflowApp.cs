using AWTGen2.Core.Utils;
using System;
using System.ComponentModel;
using System.Threading;

namespace AWTGen2.Core
{
    public sealed class WorkflowApp
    {
        private readonly WorkflowAppOption _option;
        private int _concurrency;
        private readonly BackgroundWorker _worker;
        private CancellationTokenSource _cancellation;
        private ManualResetEvent _pauseEvent;
        private readonly object _fireUnhandledWorkflowExceptionOnceLock = new();
        private bool _unhandledWorkflowExceptionOccurred;

        public int CompletedCount { get; private set; }
        public Workflow CurrentWorkflow { get; private set; }
        public Action<Exception> OnError { get; set; }
        public int Concurrency => _concurrency;
        public WorkflowAppOption Option => _option;
        public WorkflowAppState State { get; private set; }

        public WorkflowApp(WorkflowAppOption option)
        {
            Precondition.ArgumentNotNull(option.ContextFactory, nameof(option.ContextFactory));
            Precondition.ArgumentNotNull(option.InputDataFactory, nameof(option.InputDataFactory));
            Precondition.ArgumentNotNull(option.WorkflowFactory, nameof(option.WorkflowFactory));
            Precondition.ArgumentPositiveNumber(option.ParallelismCount, nameof(option.ParallelismCount));

            _option = option;
            _worker = new BackgroundWorker
            {
                WorkerSupportsCancellation = true
            };
            _worker.RunWorkerCompleted += _worker_RunWorkerCompleted;
            _worker.DoWork += _worker_DoWork;
        }

        public void Start()
        {
            if (State != WorkflowAppState.Ready)
                return;

            ChangeState(WorkflowAppState.Running);
            _cancellation = new CancellationTokenSource();
            _pauseEvent = new ManualResetEvent(true);
            _worker.RunWorkerAsync();
        }

        public void Stop()
        {
            if (State != WorkflowAppState.Running)
                return;
            
            _pauseEvent.Set();
            ChangeState(WorkflowAppState.Stopping);
            _cancellation.Cancel();
            _cancellation.Dispose();
            _pauseEvent?.Dispose();
            _worker.CancelAsync();
        }

        public void Pause()
        {
            if (State != WorkflowAppState.Running)
                return;

            _pauseEvent.Reset();
        }

        public void Resume()
        {
            if (State != WorkflowAppState.Running)
                return;

            SafeSetWaitHandle(_pauseEvent);
        }

        private void ChangeState(WorkflowAppState state)
        {
            _option.OnStateChange?.Invoke(state);
            State = state;
        }

        private void _worker_DoWork(object sender, DoWorkEventArgs e)
        {
            _option.OnStart?.Invoke();

            using var waitDoneAllEvent = new ManualResetEvent(false);
            using var slim = new SemaphoreSlim(_option.ParallelismCount);

            try
            {
                while (!_unhandledWorkflowExceptionOccurred)
                {
                    _pauseEvent.WaitOne();
                    slim.Wait(_cancellation.Token);

                    var data = _option.InputDataFactory();
                    if (data == null)
                    {
                        WaitAllDone(waitDoneAllEvent);
                        e.Result = _cancellation.IsCancellationRequested ? ResultType.Cancel : ResultType.Finish;
                        return;
                    }

                    _pauseEvent.WaitOne();
                    StartWorkflow(data, slim, waitDoneAllEvent);
                }
            }
            catch (Exception ex)
            {
                if (ex.GetType() == typeof(OperationCanceledException) || (ex is AggregateException agg && agg.HasException(typeof(OperationCanceledException))))
                {
                    e.Result = ResultType.Cancel;
                }
                else
                {
                    OnError?.Invoke(ex.LookupRootException());
                }
            }
        }

        private void WaitAllDone(ManualResetEvent waitDoneAll)
        {
            if (Interlocked.CompareExchange(ref _concurrency, 0, 0) != 0)
            {
                waitDoneAll.WaitOne();
            }
        }

        private async void StartWorkflow(object data, SemaphoreSlim slim, ManualResetEvent waitDone)
        {
            try
            {
                Interlocked.Increment(ref _concurrency);

                var workflow = await _option.WorkflowFactory(_cancellation.Token);
                var context = await _option.ContextFactory(_cancellation.Token);
                context.Input = data;
                workflow.Descriptor.Context = context;
                _option.OnWorkflowStart?.Invoke(context);
                CurrentWorkflow = workflow;
                var result = await workflow.StartAsync(context, _cancellation.Token);
                HandleWorkflowResult(result);
            }
            catch (Exception ex)
            {
                lock (_fireUnhandledWorkflowExceptionOnceLock)
                {
                    if (!_unhandledWorkflowExceptionOccurred)
                    {
                        _unhandledWorkflowExceptionOccurred = true;
                        try
                        {
                            _cancellation.Cancel();
                        }
                        catch
                        {
                            // ignored
                        }

                        OnError?.Invoke(ex.LookupRootException());
                    }
                }
            }
            finally
            {
                ReleaseWorkflow(slim, waitDone);
            }
        }

        private void HandleWorkflowResult(WorkflowResult result)
        {
            _option.OnWorkflowComplete?.Invoke(result);
        }

        private void ReleaseWorkflow(SemaphoreSlim slim, ManualResetEvent waitDone)
        {
            try
            {
                slim.Release();
            }
            catch
            {
                // ignored
            }

            CompletedCount++;

            var concurrency = Interlocked.Decrement(ref _concurrency);
            if (_cancellation.IsCancellationRequested || concurrency == 0)
            {
                SafeSetWaitHandle(waitDone);
            }
        }

        private void SafeSetWaitHandle(ManualResetEvent handle)
        {
            try
            {
                handle.Set();
            }
            catch
            {
                // ignored;
            }
        }

        private void _worker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            var finish = false;
            if (e.Result != null)
            {
                var resultType = (ResultType)e.Result;
                finish = resultType == ResultType.Finish;
            }

            _option.OnComplete?.Invoke(finish);
            ChangeState(finish ? WorkflowAppState.Completed : WorkflowAppState.Stopped);
            CurrentWorkflow = null;
        }

        private enum ResultType
        {
            Finish,
            Cancel
        }
    }
}