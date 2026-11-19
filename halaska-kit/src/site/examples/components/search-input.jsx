import { useState } from "react";
import { SearchInput, Stack, Text } from "../../kit";

export const usage = `import { SearchInput } from "./halaska-kit";

const [query, setQuery] = useState("");

<SearchInput value={query} onChange={setQuery} placeholder="Search tickets" />`;

// @example Default | A controlled field with the shortcut hint on the right.
export function Default() {
  const [query, setQuery] = useState("");
  return <SearchInput value={query} onChange={setQuery} placeholder="Search tickets" style={{ width: 320 }} />;
}

// @example With a value | The shortcut hint gives way to a clear button.
export function WithValue() {
  const [query, setQuery] = useState("refund Acme");
  return <SearchInput value={query} onChange={setQuery} placeholder="Search tickets" style={{ width: 320 }} />;
}

// @example Custom shortcut | Show the key your product binds to search.
export function CustomShortcut() {
  const [query, setQuery] = useState("");
  return <SearchInput value={query} onChange={setQuery} placeholder="Search runbooks" shortcut="/" style={{ width: 320 }} />;
}

// @example No shortcut | Pass an empty shortcut to hide the hint.
export function NoShortcut() {
  const [query, setQuery] = useState("");
  return <SearchInput value={query} onChange={setQuery} placeholder="Search customers" shortcut="" style={{ width: 320 }} />;
}

// @example Filtering a list | The value filters a list as it changes.
export function Filtering() {
  const [query, setQuery] = useState("");
  const customers = ["Acme", "Lumen Labs", "Fjord Health", "Brightline", "Cobalt Dental"];
  const matches = customers.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  return (
    <Stack gap={12} style={{ width: 320, height: 200 }}>
      <SearchInput value={query} onChange={setQuery} placeholder="Search customers" shortcut="" />
      <Stack gap={6}>
        {matches.map((name) => <Text key={name} size="sm">{name}</Text>)}
        {matches.length === 0 && <Text size="sm" secondary>No customers match "{query}".</Text>}
      </Stack>
    </Stack>
  );
}
