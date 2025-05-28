import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { updateSemesterFocus } from '@/lib/goal-handlers';

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
  const [text, setText] = useState(focus || '');
  useEffect(() => setText(focus || ''), [focus]);
  const debouncedFocustext = useDebouncedFocusText(semesterId);

  const onTextChange = (e) => {
    const text = e.target.value;
    setText(text);
    debouncedFocustext(semesterId, text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Goal Focus</CardTitle>
        <CardDescription>The main focus of our goals for the current semester.</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={onTextChange}
          placeholder='Enter the current semesters goal focus.'
        ></Textarea>
      </CardContent>
    </Card>
  );
}
