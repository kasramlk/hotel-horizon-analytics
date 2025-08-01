import { lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Lazy load Chart.js components for better performance
const Line = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Line })));
const Bar = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Bar })));
const Doughnut = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Doughnut })));
const Pie = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Pie })));

// Chart.js registration (this would normally be in a separate file)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
}

function ChartWrapper({ title, children, loading }: ChartWrapperProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Suspense fallback={<div className="h-64 bg-muted rounded animate-pulse"></div>}>
            {children}
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChartComponentProps {
  type: 'line' | 'bar' | 'doughnut' | 'pie';
  data: any;
  options?: any;
  title: string;
  loading?: boolean;
}

export function ChartComponent({ type, data, options, title, loading }: ChartComponentProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Inter'
          }
        }
      },
      tooltip: {
        titleFont: {
          family: 'Inter'
        },
        bodyFont: {
          family: 'Inter'
        }
      }
    },
    animation: {
      easing: 'easeInOutQuart' as const
    },
    ...options
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={defaultOptions} />;
      case 'bar':
        return <Bar data={data} options={defaultOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={{ ...defaultOptions, cutout: '60%' }} />;
      case 'pie':
        return <Pie data={data} options={defaultOptions} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <ChartWrapper title={title} loading={loading}>
      {renderChart()}
    </ChartWrapper>
  );
}