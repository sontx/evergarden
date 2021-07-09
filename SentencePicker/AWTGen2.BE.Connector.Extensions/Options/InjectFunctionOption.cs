namespace AWTGen2.BE.Connector.Extensions.Options
{
    public class InjectFunctionOption : TabBasedOption
    {
        /// <summary>
        /// Nameless function, example:
        /// <para>
        /// Normal function
        /// <code>
        /// function(args) {
        ///   return args.value1 + args.value2;
        /// }
        /// </code>
        /// </para>
        ///
        /// <para>
        /// Async function
        /// <code>
        /// function(args) {
        ///   return new Promise(resolve => setTimeout(resolve(args.value1 + args.value2), 5000));
        /// }
        /// </code>
        /// </para>
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// Arguments which will be passed to function:
        /// <code>
        /// function(args) {
        /// console.log(args);
        /// }
        /// </code>
        /// </summary>
        public dynamic Args { get; set; }
    }
}