import { EnhancedModal } from "../EnhancedModal";
import { isMobileOnly } from "react-device-detect";

export function AboutPanel({ onClose }: { onClose?: () => void }) {
  return (
    <EnhancedModal
      title="About"
      backdropClose
      show
      mobile={isMobileOnly}
      center
      onHide={onClose}
    >
      Hi there 😊 welcome to <strong>evergarden</strong> an awesome reading
      platform.
      <br />
      Here you can:
      <ul>
        <li>✨ Explore thousands of mysterious stories</li>
        <li>🎭 Or write your own</li>
        <li>🔍 Instantly search for any stories</li>
        <li>😘 And a lot of improvements compared to other platforms</li>
      </ul>
      There's still a lot of work to be done, but anyway thanks myself and other
      members for the hard work 💪
      <br />
      We're still looking for excellent members 😊, feel free to contact me via{" "}
      <a href="https://www.facebook.com/sontx.dev">facebook</a> or{" "}
      <a href="mailto:xuanson33bk@gmail.com">email</a> 📧
    </EnhancedModal>
  );
}
