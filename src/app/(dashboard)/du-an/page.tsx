import { FolderKanban } from 'lucide-react';
import { SectionPage } from '@/components/layout/section-page';

export default function ProjectsPage() {
  return <SectionPage title="Dự án" description="Theo dõi tiến độ, trạng thái và các tệp thuộc từng dự án." icon={FolderKanban} />;
}
