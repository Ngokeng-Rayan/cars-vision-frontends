import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const BarChart = ({
    data = [],
    xKey = 'name',
    bars = [],
    height = 300,
    className = ''
}) => {
    const colors = ['#4DB896', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']

    return (
        <div className={className}>
            <ResponsiveContainer width="100%" height={height}>
                <RechartsBarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                        dataKey={xKey}
                        stroke="#6B7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#6B7280"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                    />
                    <Legend />
                    {bars.map((bar, index) => (
                        <Bar
                            key={bar.dataKey}
                            dataKey={bar.dataKey}
                            name={bar.name}
                            fill={bar.color || colors[index % colors.length]}
                            radius={[8, 8, 0, 0]}
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default BarChart
