using System.Collections.Generic;

namespace AWTGen2.Core.Utils
{
    public sealed class WorkChain<T>
    {
        private readonly List<IChain> _chains;

        public WorkChain(List<IChain> chains)
        {
            _chains = chains;
        }

        public WorkChain()
        {
            _chains = new List<IChain>();
        }

        public WorkChain<T> Add(IChain chain)
        {
            _chains.Add(chain);
            return this;
        }

        public object Do(T data)
        {
            foreach (var chain in _chains)
            {
                var chainState = new ChainState<T>(data);
                data = chain.Handle(chainState);
                if (chainState.Handled)
                    return data;
            }

            return data;
        }

        public interface IChain
        {
            T Handle(ChainState<T> state);
        }

        public class ChainState<TT>
        {
            public bool Handled { get; set; }
            public TT Data { get; }

            public ChainState(TT data)
            {
                Data = data;
            }
        }
    }
}