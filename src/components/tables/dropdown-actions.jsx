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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

export function DropdownActions({ actions = [] }) {
  const [openDialogKey, setOpenDialogKey] = useState(null);
  useBlockContextMenu(!!openDialogKey);
  const isMobile = useIsMobile();

  return (
    <Dialog open={!!openDialogKey} onOpenChange={(val) => !val && setOpenDialogKey(null)}>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='ml-2' aria-label='Dropdown actions'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent
            side='left'
            align='center'
            hidden={isMobile}
            children='View more actions'
          />
        </Tooltip>
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
                <DropdownMenuItem>
                  <div className='flex items-center gap-2'>
                    {action.icon && (
                      <action.icon className={action.destructive ? 'text-destructive' : ''} />
                    )}
                    <span>{action.text}</span>
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
            ) : (
              <DropdownMenuItem
                key={action.text}
                onClick={action.action}
                className={action.destructive ? 'text-destructive' : ''}
                disabled={action.disabled}
              >
                <div className='flex items-center gap-2'>
                  {action.icon && (
                    <action.icon className={action.destructive ? 'text-destructive' : ''} />
                  )}
                  <span>{action.text}</span>
                </div>
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
