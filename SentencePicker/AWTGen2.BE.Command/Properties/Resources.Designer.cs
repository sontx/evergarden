﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AWTGen2.BE.Command.Properties {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "16.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class Resources {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Resources() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("AWTGen2.BE.Command.Properties.Resources", typeof(Resources).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to {
        ///  &quot;name&quot;: &quot;com.autowebtools.chrome&quot;,
        ///  &quot;description&quot;: &quot;AutoWebTools Native Messaging Host for Chrome&quot;,
        ///  &quot;path&quot;: &quot;bin/BrowserExtension.NativeHost.exe&quot;,
        ///  &quot;type&quot;: &quot;stdio&quot;,
        ///  &quot;allowed_origins&quot;: [
        ///    &quot;chrome-extension://nofnkjlikdgjlemogmoilalgeldcamfh/&quot;
        ///  ]
        ///}.
        /// </summary>
        internal static string ChromeNativeMessageManifest {
            get {
                return ResourceManager.GetString("ChromeNativeMessageManifest", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to {
        ///  &quot;name&quot;: &quot;com.autowebtools.edge&quot;,
        ///  &quot;description&quot;: &quot;AutoWebTools Native Messaging Host for Chrome&quot;,
        ///  &quot;path&quot;: &quot;bin/BrowserExtension.NativeHost.exe&quot;,
        ///  &quot;type&quot;: &quot;stdio&quot;,
        ///  &quot;allowed_origins&quot;: [
        ///    &quot;chrome-extension://nofnkjlikdgjlemogmoilalgeldcamfh/&quot;
        ///  ]
        ///}.
        /// </summary>
        internal static string EdgeNativeMessageManifest {
            get {
                return ResourceManager.GetString("EdgeNativeMessageManifest", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to {
        ///  &quot;name&quot;: &quot;com.autowebtools.firefox&quot;,
        ///  &quot;description&quot;: &quot;AutoWebTools Native Messaging Host for Chrome&quot;,
        ///  &quot;path&quot;: &quot;bin/BrowserExtension.NativeHost.exe&quot;,
        ///  &quot;type&quot;: &quot;stdio&quot;,
        ///  &quot;allowed_extensions&quot;: [ &quot;addon@autowebtools.com&quot; ]
        ///}.
        /// </summary>
        internal static string FirefoxNativeMessageManifest {
            get {
                return ResourceManager.GetString("FirefoxNativeMessageManifest", resourceCulture);
            }
        }
    }
}
