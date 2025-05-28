import { useState, Fragment } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useBlockContextMenu } from '@/hooks/use-block-context-menu';

export function ContextActions({ children, actions = [] }) {
  const [openDialogKey, setOpenDialogKey] = useState(null);
  useBlockContextMenu(!!openDialogKey);
  
  return (
    <Dialog open={!!openDialogKey} onOpenChange={(val) => !val && setOpenDialogKey(null)}>
      <ContextMenu>
        <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
        <ContextMenuContent className='w-48'>
          {actions.map((action, i) =>
            action === 'seperator' ? (
              <ContextMenuSeparator key={i} />
            ) : action.dialog ? (
              <DialogTrigger
                asChild
                key={action.text}
                onClick={() => setOpenDialogKey(action.text)}
                className={action.destructive ? 'text-destructive' : ''}
                disabled={action.disabled}
              >
                <ContextMenuItem>{action.text}</ContextMenuItem>
              </DialogTrigger>
            ) : (
              <ContextMenuItem
                key={action.text}
                onClick={action.action}
                className={action.destructive ? 'text-destructive' : ''}
                disabled={action.disabled}
              >
                {action.text}
              </ContextMenuItem>
            ),
          )}
        </ContextMenuContent>
      </ContextMenu>

      {actions.map((action) =>
        action.dialog && action.text === openDialogKey ? (
          <Fragment key={action.text}>
            {action.dialogContent({
              onSuccess: (success) => {
                if (success) {
                  setOpenDialogKey(null);
                }
              },
            })}
          </Fragment>
        ) : null,
      )}
    </Dialog>
  );
}
