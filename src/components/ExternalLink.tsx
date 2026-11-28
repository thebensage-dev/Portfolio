/** A link that opens another site in a new tab. */
export default function ExternalLink(props: Omit<React.ComponentProps<"a">, "target" | "rel">) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}
