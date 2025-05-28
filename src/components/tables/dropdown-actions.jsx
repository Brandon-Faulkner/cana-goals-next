import { useState, Fragment } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useBlockContextMenu } from '@/hooks/use-block-context-menu';

export function DropdownActions({ actions = [] }) {
  const [openDialogKey, setOpenDialogKey] = useState(null);
  useBlockContextMenu(!!openDialogKey);

  return (
    <Dialog open={!!openDialogKey} onOpenChange={(val) => !val && setOpenDialogKey(null)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='ml-2'>
            <MoreVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {actions.map((action, i) =>
            action === 'seperator' ? (
              <DropdownMenuSeparator key={i} />
            ) : action.dialog ? (
              <DialogTrigger
                asChild
                key={action.text}
                onClick={() => setOpenDialogKey(action.text)}
                className={action.destructive ? 'text-destructive' : ''}
                disabled={action.disabled}
              >
                <DropdownMenuItem>{action.text}</DropdownMenuItem>
              </DialogTrigger>
            ) : (
              <DropdownMenuItem
                key={action.text}
                onClick={action.action}
                className={action.destructive ? 'text-destructive' : ''}
                disabled={action.disabled}
              >
                {action.text}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
