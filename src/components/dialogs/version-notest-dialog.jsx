import { versionNotes } from '@/data/version-notes';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

export function VersionNotesDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>What's New</DialogTitle>
          <DialogDescription>
            Latest updates, new features, and improvements to the application.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='space-y-6'>
          <Accordion type='single' collapsible defaultValue='item-0' className='w-full'>
            {versionNotes.versions.map((version, versionIndex) => (
              <AccordionItem key={version.version} value={`item-${versionIndex}`}>
                <AccordionTrigger>
                  <span>
                    Version {version.version}
                    {version.version === versionNotes.currentVersion && (
                      <span className='text-primary ml-2 text-sm font-normal'>(Latest)</span>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='space-y-4'>
                    {version.features.map((feature, featureIndex) => (
                      <div key={featureIndex}>
                        <h4 className='text-primary mb-2 font-semibold'>{feature.title}</h4>
                        <ul className='ml-4 space-y-1'>
                          {feature.items.map((item, itemIndex) => (
                            <li key={itemIndex} className='list-disc text-sm'>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
