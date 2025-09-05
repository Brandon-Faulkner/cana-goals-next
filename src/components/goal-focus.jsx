import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import debounce from 'lodash/debounce';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { updateSemesterFocus } from '@/lib/goal-handlers';
import { useAuth } from '@/contexts/auth-context';

const useDebouncedFocusText = (semesterId) => {
  return useCallback(
    debounce((text) => {
      toast.promise(updateSemesterFocus(semesterId, text), {
        loading: 'Saving goal focus changes...',
        success: 'Goal focus changes saved',
        error: 'Failed to save goal focus changes',
      });
    }, 1000),
    [semesterId],
  );
};

export function GoalFocus({ semesterId, focus }) {
  const { userDoc } = useAuth();
  const isAdmin = userDoc?.admin;
  const [text, setText] = useState(focus || '');
  useEffect(() => setText(focus || ''), [focus]);
  const debouncedFocustext = useDebouncedFocusText(semesterId);

  const handleTextChange = (e) => {
    const text = e.target.value;
    setText(text);
    debouncedFocustext(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>Goal Focus</CardTitle>
        <CardDescription>The main focus of our goals for the current semester.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={handleTextChange}
          placeholder='Enter the current semesters goal focus.'
          readOnly={!isAdmin}
          disabled={!isAdmin}
        ></Textarea>
      </CardContent>
    </Card>
  );
}
