'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

type ChartProps = {
    items: {
        month: string;
        value: number;
    }[];
};

const Chart = ({ items }: ChartProps) => {
    return (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                width={500}
                height={300}
                data={items}
                margin={{
                    top: 5,
                    right: 20,
                    left: -10,
                    bottom: 0,
                }}
                    >
                        <XAxis
                    dataKey="month"
                    tickLine={false}
                            axisLine={false}
                            tick={{
                        fontSize: 12,
                        fontWeight: '500',
                        fill: 'var(--gray)',
                            }}
                        />
                        <YAxis
                    tickLine={false}
                            axisLine={false}
                            tick={{
                        fontSize: 12,
                        fontWeight: '500',
                        fill: 'var(--gray)',
                            }}
                        />
                        <Tooltip
                    contentStyle={{
                        background: 'var(--white)',
                        border: 'none',
                        borderRadius: '0.5rem',
                        boxShadow:
                            '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.1)',
                        padding: '0.5rem',
                    }}
                    labelStyle={{
                        color: 'var(--dark)',
                        fontSize: 12,
                        fontWeight: '700',
                    }}
                    itemStyle={{
                        color: 'var(--dark)',
                        fontSize: 12,
                        fontWeight: '500',
                    }}
                        />
                        <Line
                            type="monotone"
                    dataKey="value"
                    stroke={'var(--primary-01)'}
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
    );
};

export default Chart;
