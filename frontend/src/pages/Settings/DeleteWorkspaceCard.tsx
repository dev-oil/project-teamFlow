import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DeleteWorkspaceCard = () => {
  const handleDelete = () => {
    console.log('워크스페이스 삭제');
  };

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-600">워크스페이스 삭제</CardTitle>
      </CardHeader>
      <CardContent>
        <p>워크스페이스를 삭제하면 모든 데이터가 영구적으로 제거됩니다. 이 작업은 되돌릴 수 없습니다.</p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={handleDelete} className="text-red-600" >워크스페이스 삭제하기</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeleteWorkspaceCard;
