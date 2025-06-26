import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
  CardAction,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const registerSchema = z
  .object({
    name: z.string().min(1, '이름을 입력하세요'),
    phone: z.string().min(10, '전화번호를 입력하세요'),
    email: z.string().email('유효한 이메일을 입력하세요'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    console.log('회원가입 정보:', data);
    navigate('/', { replace: true });
  };

  return (
    <div className='w-1/2 flex items-center justify-center'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Create an Account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid gap-5'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' placeholder='홍길동' {...register('name')} />
                {errors.name && (
                  <p className='text-sm text-red-500'>{errors.name.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='phone'>Phone</Label>
                <Input
                  id='phone'
                  placeholder='01012345678'
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className='text-sm text-red-500'>{errors.phone.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  placeholder='email@example.com'
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-sm text-red-500'>{errors.email.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className='text-sm text-red-500'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <Button type='submit' className='w-full'>
              Sign Up
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <CardAction className='w-full'>
            <p className='text-center text-sm text-muted-foreground'>
              Already have an account?
              <Button
                variant='link'
                className='text-blue-600'
                onClick={() => navigate('/login', { replace: true })}
              >
                Login
              </Button>
            </p>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
