import { useState, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CircleX, BriefcaseBusiness, CheckCheck, Hourglass, TriangleAlert } from 'lucide-react';

export const chartConfig = {
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

export function SemesterOverview({ semesterData }) {
  const [activeChart, setActiveChart] = useState('goals');

  const total = useMemo(
    () => ({
      goals: semesterData.reduce((acc, curr) => acc + curr.goals, 0),
      blocks: semesterData.reduce((acc, curr) => acc + curr.blocks, 0),
    }),
    [semesterData],
  );

  return (
    <Card className='py-0'>
      <CardHeader className='flex flex-col items-stretch border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0'>
          <CardTitle className='text-lg'>Semester Overview</CardTitle>
          <CardDescription>These values come from the statuses of goals and building blocks that are not empty for this semester.</CardDescription>
        </div>
        <div className='flex'>
          {['goals', 'blocks'].map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className='data-[active=true]:bg-muted/50 relative flex flex-1 cursor-pointer flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
              onClick={() => setActiveChart(key)}
            >
              <span className='text-muted-foreground text-xs'>{chartConfig[key].label}</span>
              <span className='text-lg leading-none font-bold sm:text-3xl'>
                {total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={'max-h-80 min-h-48 w-full'}>
          <BarChart
            accessibilityLayer
            data={semesterData}
            layout='vertical'
            margin={{
              left: -30,
              right: 15,
            }}
          >
            <CartesianGrid horizontal vertical strokeDasharray='3 3' />
            <XAxis type='number' />
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
      </CardContent>
    </Card>
  );
}
