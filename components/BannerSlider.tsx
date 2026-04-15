'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { banners } from '@/lib/data';

export function BannerSlider() {
    const { lang } = useStore();

    return (
        <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            loop
            className="w-full rounded-xl overflow-hidden"
        >
            {banners.map(banner => (
                <SwiperSlide key={banner.id}>
                    <Link href={banner.link}>
                        <div className={`relative bg-gradient-to-r ${banner.bg} min-h-[160px] md:min-h-[320px] overflow-hidden flex items-center`}>

                            {/* Full-height background image — right side, fading into gradient */}
                            <div
                                className="absolute inset-y-0 right-0 w-1/2 md:w-[45%]"
                                style={{
                                    backgroundImage: `url(${banner.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    maskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
                                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
                                }}
                            />

                            {/* Dark overlay on image area for readability */}
                            <div className="absolute inset-y-0 right-0 w-1/2 md:w-[45%] bg-black/20" />

                            {/* Text content — left side */}
                            <div className="relative z-10 px-8 md:px-16 py-8 max-w-[58%]">
                                <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 border border-white/30 backdrop-blur-sm">
                                    {lang === 'uz' ? banner.badge : banner.badgeRu}
                                </span>
                                <h2 className="text-white text-2xl md:text-4xl font-extrabold leading-tight drop-shadow-lg">
                                    {lang === 'uz' ? banner.title : banner.titleRu}
                                </h2>
                                <p className="text-white/80 mt-2 text-sm md:text-base drop-shadow">
                                    {lang === 'uz' ? banner.subtitle : banner.subtitleRu}
                                </p>
                                <div className="mt-5 inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-lg">
                                    {lang === 'uz' ? "Ko'proq" : "Подробнее"} →
                                </div>
                            </div>
                        </div>
                    </Link>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
