import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AddBoxFormProps = {
  page: 'mainpage' | 'dashpage';
  onAdd: (title: string) => void;
};

export const AddBoxForm = ({ page, onAdd }: AddBoxFormProps) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('박스 이름을 입력해주세요.');
      return;
    }

    onAdd(title);
    setTitle('');
  };

  const wrapperClass =
    page === 'mainpage' ? 'mb-6 flex justify-between' : 'mb-6 flex justify-end';
  const formWidthClass = page === 'mainpage' ? 'max-w-md' : 'max-w-sm';

  return (
    <div className={wrapperClass}>
      {page === 'mainpage' && (
        <h1 className='text-2xl font-bold text-gray-800'>작업보드</h1>
      )}
      <form
        onSubmit={handleSubmit}
        className={`flex w-full ${formWidthClass} items-center gap-2`}
      >
        <Input
          type='text'
          placeholder='박스 이름'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type='submit' variant='default'>
          + 박스 추가하기
        </Button>
      </form>
    </div>
  );
};
