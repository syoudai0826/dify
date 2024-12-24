import Header from '../signin/_header'
import cn from '@/utils/classnames'

export default async function SignInLayout({ children }: any) {
  return <>
    <div className={cn(
      'bg-background-default-burn',
      'flex w-full min-h-screen',
      'sm:p-4 lg:p-6',
      'justify-center',
    )}>
      <div className={
        cn(
          'flex w-full flex-col bg-background-default-subtle border border-effects-highlight rounded-2xl shrink-0',
          'space-between',
        )
      }>
        <Header />
        <div className={
          cn(
            'flex flex-col items-center w-full grow justify-center',
            'md:px-[108px]',
          )
        }>
          <div className='p-8 flex flex-col md:w-[464px]'>
            {children}
          </div>
        </div>
        <div className='px-8 py-6 system-xs-regular text-text-tertiary'>
          © {new Date().getFullYear()} LangGenius, Inc. All rights reserved.
        </div>
      </div>
    </div>
  </>
}
