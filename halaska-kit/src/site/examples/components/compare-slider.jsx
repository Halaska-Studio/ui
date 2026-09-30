import { BeforeAfterToggle, CompareSlider } from "../../kit";

export const usage = `import { CompareSlider } from "./halaska-kit";

<CompareSlider before={<FirstDraft />} after={<AlphaRewrite />} />`;

// @example Default | Two layers behind a divider. The before layer sets the size.
export function Default() {
  return (
    <CompareSlider
      style={{ width: 440 }}
      before={
        <div style={{ height: 200, padding: "56px 28px 0", boxSizing: "border-box", background: "#e7e5e4", color: "#44403c", fontFamily: "Times New Roman, serif", fontSize: 15, lineHeight: 1.5 }}>
          hi, we looked into it and you got charged 2x. refund is coming.
        </div>
      }
      after={
        <div style={{ height: 200, padding: "56px 28px 0", boxSizing: "border-box", background: "#18181b", color: "#fafafa", fontSize: 15, lineHeight: 1.5 }}>
          Hi Priya, you were charged twice for September. I have refunded the duplicate $49. It should arrive in 3 to 5 days.
        </div>
      }
    />
  );
}

// @example Custom labels | Name the two sides.
export function CustomLabels() {
  return (
    <CompareSlider
      style={{ width: 440 }}
      labels={["Draft", "Alpha"]}
      before={
        <div style={{ height: 180, padding: "56px 28px 0", boxSizing: "border-box", background: "#e7e5e4", color: "#44403c", fontSize: 15, lineHeight: 1.5 }}>
          Export is broken for some customers, not sure why. Needs a look.
        </div>
      }
      after={
        <div style={{ height: 180, padding: "56px 28px 0", boxSizing: "border-box", background: "#18181b", color: "#fafafa", fontSize: 15, lineHeight: 1.5 }}>
          CSV export fails for workspaces over 10,000 rows. Three Lumen Labs tickets confirm it.
        </div>
      }
    />
  );
}

// @example Starting position | Set initial from 0 to 1 to favour one side.
export function StartingPosition() {
  return (
    <CompareSlider
      style={{ width: 440 }}
      initial={0.25}
      labels={["Last week", "This week"]}
      before={
        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", background: "#e7e5e4", color: "#44403c", fontSize: 40, fontWeight: 600 }}>
          11m reply time
        </div>
      }
      after={
        <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", background: "#18181b", color: "#fafafa", fontSize: 40, fontWeight: 600 }}>
          4m reply time
        </div>
      }
    />
  );
}

// @example Before and after toggle | Shows one version at a time behind a switch. The box keeps the height of the taller one.
export function Toggle() {
  return (
    <div style={{ width: 400 }}>
      <BeforeAfterToggle
        before={
          <div style={{ padding: 24, background: "#e7e5e4", color: "#44403c", fontSize: 15, lineHeight: 1.5 }}>
            hi, we looked into it and you got charged 2x. refund is coming.
          </div>
        }
        after={
          <div style={{ padding: 24, background: "#18181b", color: "#fafafa", fontSize: 15, lineHeight: 1.5 }}>
            Hi Priya, you were charged twice for September. I have refunded the duplicate $49. It should arrive in 3 to 5 days.
          </div>
        }
      />
    </div>
  );
}
