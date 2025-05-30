import { goalLanguageContent } from '@/data/goal-language';
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

export function GoalLanguageDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Goal Language</DialogTitle>
          <DialogDescription>
            Information about what goal language is and how it is used.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='space-y-6'>
          <Accordion type='single' collapsible defaultValue='item-1' className='w-full'>
            <AccordionItem value='item-1'>
              <AccordionTrigger>{goalLanguageContent.goalsShouldBe.title}</AccordionTrigger>
              <AccordionContent>
                {goalLanguageContent.goalsShouldBe.items.map((item, index) => (
                  <p key={index} className='mb-2'>
                    <strong className='text-primary'>{item.term}</strong> - {item.description}
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
              <AccordionTrigger>{goalLanguageContent.goalLanguage.title}</AccordionTrigger>
              <AccordionContent>
                {goalLanguageContent.goalLanguage.items.map((item, index) => (
                  <p key={index} className='mb-2'>
                    <strong className='text-primary'>{item.term}</strong> - {item.description}
                    {item.note && <strong>&ensp;{item.note}</strong>}
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
              <AccordionTrigger>{goalLanguageContent.goalRecording.title}</AccordionTrigger>
              <AccordionContent>
                {goalLanguageContent.goalRecording.items.map((item, index) => (
                  <p key={index} className='mb-2'>
                    <strong className='text-primary'>{item.term}</strong> - {item.description}
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
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
