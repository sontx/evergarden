export function PublishSub({ published }: { published?: boolean }) {
  return published ? (
    <span style={{ color: "green", fontWeight: "bold" }}>Published</span>
  ) : (
    <span style={{ color: "rgba(255, 255, 255, 0.45)" }}>Unpublished</span>
  );
}
