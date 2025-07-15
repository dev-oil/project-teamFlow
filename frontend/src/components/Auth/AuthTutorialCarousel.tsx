import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

export function AuthTutorialCarousel() {
  const slides = [
    {
      title: '🎉 TeamFlow에 가입하고 시작하세요',
      desc: '간단한 정보 입력만으로 회원가입이 완료됩니다. 이메일 주소와 비밀번호를 입력하고, 이제 TeamFlow를 시작해보세요.',
      path: '/회원가입.png',
    },
    {
      title: '📌 커스텀 가능한 보드로 한눈에 관리',
      desc: '작업 보드에서 카드로 할 일을 관리하세요. 드래그 앤 드롭으로 진행 상태를 변경하고, 작업의 우선순위를 쉽게 조정할 수 있습니다.',
      path: '/작업보드.png',
    },
    {
      title: '📝 회의록 작성으로 회의 내용 정리하기',
      desc: '회의 제목과 참석자를 입력하고, 달력에서 날짜를 선택해 회의 일시를 지정하세요. 필요한 파일을 첨부하고 내용을 입력하면 쉽게 회의록을 저장할 수 있어요.',
      path: '/회의록.png',
    },
    {
      title: '📅 한눈에 보는 일정 관리',
      desc: '중요한 일정과 할 일을 달력에서 한눈에 확인하세요. 카테고리별, 색상별로 구분되어 가독성이 뛰어나요.',
      path: '/달력.png',
    },
    {
      title: '👥 팀원 관리 및 초대하기',
      desc: '워크스페이스 이름을 변경하고, 팀원 초대 및 게스트 관리가 가능합니다. 초대 메일을 보내거나 대기 중인 게스트를 다시 초대하세요.',
      path: '/워크스페이스 설정_초대.png',
    },
  ];

  return (
    <div className='w-1/2 bg-muted flex items-center justify-center p-10'>
      <Carousel
        className='w-full max-w-xl'
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
      >
        <CarouselContent>
          {slides.map((item, index) => (
            <CarouselItem key={index}>
              <div className='p-6 bg-white rounded-xl shadow'>
                <img
                  src={item.path} // 실제 경로로 수정
                  alt='Tutorial'
                  className='rounded-xl w-full object-cover mb-3'
                />
                <h3 className='text-xl font-bold mb-2'>{item.title}</h3>
                <p className='text-sm text-muted-foreground'>{item.desc}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
