import "./authLoading.less";
export function AuthLoading(props: { title?: string }) {
  return (
    <div className="auth-loading-container">
      <h1>{props.title}</h1>
      <ul className="bg-bubbles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}
