import { useState, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CircleX, BriefcaseBusiness, CheckCheck, Hourglass, TriangleAlert } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export const chartConfig = {
  teamProgress: {
    label: 'Goal Completion',
  },
  goals: {
    label: 'Goals',
  },
  blocks: {
    label: 'Blocks',
  },
  notworkingon: {
    label: 'Not Working On',
    color: 'var(--chart-1)',
    icon: <CircleX size={20} />,
  },
  workingon: {
    label: 'Working On',
    color: 'var(--chart-2)',
    icon: <BriefcaseBusiness size={20} />,
  },
  completed: {
    label: 'Completed',
    color: 'var(--chart-3)',
    icon: <CheckCheck size={20} />,
  },
  waiting: {
    label: 'Waiting',
    color: 'var(--chart-4)',
    icon: <Hourglass size={20} />,
  },
  stuck: {
    label: 'Stuck',
    color: 'var(--chart-5)',
    icon: <TriangleAlert size={20} />,
  },
};

export function SemesterOverview({ semesterData, peopleData }) {
  const [activeChart, setActiveChart] = useState('teamProgress');

  const teamProgress = useMemo(() => {
    if (!peopleData) return [];
    return [...peopleData]
      .sort((a, b) => b.goals - a.goals)
      .map((person, idx) => ({
        ...person,
        rank: idx + 1,
      }));
  }, [peopleData]);

  const total = useMemo(() => {
    const totalGoals = semesterData.reduce((acc, curr) => acc + curr.goals, 0);
    const completedGoals = semesterData.find((s) => s.status === 'completed')?.goals || 0;
    const completionRate = totalGoals ? Math.round((completedGoals / totalGoals) * 100) : 0;
    return {
      teamProgress: completionRate + '%',
      goals: totalGoals,
      blocks: semesterData.reduce((acc, curr) => acc + curr.blocks, 0),
    };
  }, [semesterData]);

  return (
    <Card className='py-0'>
      <CardHeader className='flex flex-col items-stretch border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3'>
          <CardTitle className='text-lg'>Semester Overview</CardTitle>
          <CardDescription>
            These values come from the statuses of goals and building blocks that are not empty for
            this semester.
          </CardDescription>
        </div>
        <div className='xxs:flex-row flex flex-col'>
          {['teamProgress', 'goals', 'blocks'].map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className='data-[active=true]:bg-muted/50 relative flex flex-1 cursor-pointer flex-col justify-center gap-1 border-t border-l px-6 py-4 text-left even:border-l sm:border-t-0 sm:px-8 sm:py-6 md:min-w-40'
              onClick={() => setActiveChart(key)}
            >
              <span className='text-muted-foreground text-xs'>{chartConfig[key].label}</span>
              <span className='text-lg leading-none font-bold sm:text-3xl'>
                {total[key]?.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className={activeChart === 'teamProgress' ? 'mb-5' : ''}>
        {activeChart === 'teamProgress' ? (
          <Table className='max-h-80'>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Goals</TableHead>
                <TableHead>Goals Completed</TableHead>
                <TableHead>Blocks</TableHead>
                <TableHead>Blocks Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamProgress.map((person) => (
                <TableRow key={person.id || person.name}>
                  <TableCell>{person.name}</TableCell>
                  <TableCell>{person.goals}</TableCell>
                  <TableCell className={person.goalsCompleted !== 0 ? 'text-primary' : ''}>
                    {person.goalsCompleted}
                  </TableCell>
                  <TableCell>{person.blocks}</TableCell>
                  <TableCell className={person.blocksCompleted !== 0 ? 'text-primary' : ''}>
                    {person.blocksCompleted}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <ChartContainer
            config={chartConfig}
            className={'max-h-80 min-h-48 w-full overflow-hidden'}
          >
            <BarChart
              accessibilityLayer
              data={semesterData}
              layout='vertical'
              margin={{
                left: -30,
                right: 15,
                bottom: 20,
              }}
            >
              <CartesianGrid horizontal vertical strokeDasharray='3 3' />
              <XAxis type='number' hide />
              <YAxis
                dataKey='status'
                type='category'
                tickLine={false}
                axisLine={false}
                tick={({ x, y, payload }) => {
                  const Icon = chartConfig[payload.value]?.icon;
                  return (
                    <foreignObject x={x - 20} y={y - 10} width={20} height={20}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        {Icon}
                      </div>
                    </foreignObject>
                  );
                }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey={activeChart} radius={5}>
                <LabelList position='right' offset={6} className='fill-foreground' fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
