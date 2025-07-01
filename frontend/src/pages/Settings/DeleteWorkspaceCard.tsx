import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type Props = {
  workspaceId: number;
  onDeleted?: () => void; // 삭제 후 행동(예: 리디렉션)
};

const DeleteWorkspaceCard = ({ workspaceId, onDeleted }: Props) => {
  const handleDelete = async () => {
    if (!confirm('정말 이 워크스페이스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('삭제 실패');

      alert('워크스페이스가 삭제되었습니다.');
      onDeleted?.(); // 필요 시 리디렉션 등 수행
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    // <Card className="border-red-200">
    //   <CardHeader>
    //     <CardTitle className="text-red-600">워크스페이스 삭제</CardTitle>
    //   </CardHeader>
    //   <CardContent>
    //     <p>워크스페이스를 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수 없습니다.</p>
    //     <div className="flex justify-end mt-4">
    //       <Button variant="outline" onClick={handleDelete} className="text-red-600" >워크스페이스 삭제하기</Button>
    //     </div>
    //   </CardContent>
    // </Card>
    <Card className="border-red-200">
  <CardHeader>
    <CardTitle className="text-red-700 text-lg font-bold"> 워크스페이스 삭제</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-red-600">
      워크스페이스를 삭제하면 <strong>모든 데이터가 영구적으로 제거</strong>됩니다.<br />
      이 작업은 되돌릴 수 없습니다.
    </p>
    <div className="flex justify-end mt-6">
      <Button
        variant="outline" 
        className="text-red-600"
        onClick={handleDelete}
      >
        워크스페이스 삭제하기
      </Button>
    </div>
  </CardContent>
</Card>
  );
};

export default DeleteWorkspaceCard;
