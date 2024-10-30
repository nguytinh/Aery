import { Avatar} from '@/components/ui/avatar'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div>
      <Avatar>

      </Avatar>
      {id}
    </div>
  );
}
