'use client';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CircleX, BriefcaseBusiness, CheckCheck, Hourglass, TriangleAlert } from 'lucide-react';

export const chartConfig = {
  total: {
    label: 'Total',
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Semester Overview</CardTitle>
        <CardDescription>
          These values come from the statuses of goals and building blocks that are not empty for
          this semester.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={'max-h-80 min-h-48 w-full'}>
          <BarChart
            accessibilityLayer
            data={semesterData}
            layout='vertical'
            margin={{
              left: -30,
              right: 10,
            }}
          >
            <CartesianGrid horizontal vertical strokeDasharray='3 3' />
            <XAxis type='number' dataKey='total' />
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
            <Bar dataKey='total' radius={5}>
              <LabelList position='right' offset={6} className='fill-foreground' fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
