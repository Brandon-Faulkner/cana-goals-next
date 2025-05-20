import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator
} from "@/components/ui/context-menu";

export function ContextActions({ children, actions = [] }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {actions.map((action, i) =>
          action === "seperator" ? (
            <ContextMenuSeparator key={i} />
          ) : (
            <ContextMenuItem
              key={action.text}
              onClick={action.action}
              className={action.destructive ? "text-destructive" : ""}
            >
              {action.text}
            </ContextMenuItem>
          )
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}