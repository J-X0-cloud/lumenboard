import { Icon } from "./icons";

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="checks">
      {items.map((item) => (
        <li key={item}>
          <Icon name="check" />
          {item}
        </li>
      ))}
    </ul>
  );
}
