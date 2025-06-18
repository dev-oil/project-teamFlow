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
      title: 'Streamline Your Workflow',
      desc: 'Track tasks, stay organized, and collaborate in real-time.',
    },
    {
      title: 'Boost Team Productivity',
      desc: 'Achieve goals faster with better communication.',
    },
    {
      title: 'Centralize Your Work',
      desc: 'All your work in one place for better focus.',
    },
  ];

  return (
    <div className='w-1/2 bg-muted flex items-center justify-center p-10'>
      <Carousel
        className='w-full max-w-md'
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
                  src='/test1.jpg' // 실제 경로로 수정
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
