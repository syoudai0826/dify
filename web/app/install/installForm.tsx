'use client'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Loading from '../components/base/loading'
import Input from '../components/base/input'
import classNames from '@/utils/classnames'
import Button from '@/app/components/base/button'

import { fetchInitValidateStatus, fetchSetupStatus, setup } from '@/service/common'
import type { InitValidateStatusResponse, SetupStatusResponse } from '@/models/common'

const validPassword = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/

const accountFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'login.error.emailInValid' })
    .email('login.error.emailInValid'),
  name: z.string().min(1, { message: 'login.error.nameEmpty' }),
  password: z.string().min(8, {
    message: 'login.error.passwordLengthInValid',
  }).regex(validPassword, 'login.error.passwordInvalid'),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

const InstallForm = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: '',
      password: '',
      email: '',
    },
  })

  const onSubmit: SubmitHandler<AccountFormValues> = async (data) => {
    console.log(data)
    await setup({
      body: {
        ...data,
      },
    })
    router.push('/signin')
  }

  const handleSetting = async () => {
    handleSubmit(onSubmit)()
  }

  useEffect(() => {
    try {
      fetchSetupStatus().then((res: SetupStatusResponse) => {
        if (res.step === 'finished') {
          localStorage.setItem('setup_status', 'finished')
          window.location.href = '/signin'
        }
        else {
          fetchInitValidateStatus().then((res: InitValidateStatusResponse) => {
            if (res.status === 'not_started')
              window.location.href = '/init'
          })
        }
        setLoading(false)
      })
    }
    catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [])

  return (
    !loading
      ? <Loading />
      : <>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-[32px] font-bold text-text-primary">{t('login.setAdminAccount')}</h2>
          <p className='
          mt-1 text-sm text-text-secondary
        '>{t('login.setAdminAccountDesc')}</p>
        </div>
        <div className="grow mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-5'>
                <label htmlFor="email" className="my-2 flex items-center justify-between system-sm-medium text-text-primary">
                  {t('login.email')}
                </label>
                <div className="mt-1">
                  <Controller name='email'
                    control={control}
                    render={({ field }) =>
                      <Input {...field} placeholder={t('login.emailPlaceholder') || ''} />}
                  />
                  {errors.email && <span className='text-text-warning text-sm'>{t(`${errors.email?.message}`)}</span>}
                </div>
              </div>
              <div className='mb-5'>
                <label htmlFor="name" className="my-2 flex items-center justify-between system-sm-medium text-text-primary">
                  {t('login.name')}
                </label>
                <div className="mt-1">
                  <Controller name='name'
                    control={control}
                    render={({ field }) =>
                      <Input {...field} placeholder={t('login.namePlaceholder') || ''}
                      />} />
                </div>
                {errors.name && <span className='text-text-warning text-sm'>{t(`${errors.name.message}`)}</span>}
              </div>

              <div className='mb-5'>
                <label htmlFor="password" className="my-2 flex items-center justify-between system-sm-medium text-text-primary">
                  {t('login.password')}
                </label>

                <div className="mt-1">
                  <Controller name='password' control={control} render={({ field }) =>
                    <div className='relative'>
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('login.passwordPlaceholder') || ''}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? '👀' : '😝'}
                        </button>
                      </div>
                    </div>
                  } />
                </div>
                <div className={classNames('mt-1 system-xs-regular', {
                  'text-text-warning ': errors.password,
                })}>{t('login.error.passwordInvalid')}</div>
              </div>
              <div>
                <Button variant='primary' className='w-full' onClick={handleSetting}>
                  {t('login.installBtn')}
                </Button>
              </div>
            </form>
            <div className="block w-full mt-2 system-xs-regular text-text-secondary">
              {t('login.license.tip')}
              &nbsp;
              <Link
                className='text-text-accent'
                target='_blank' rel='noopener noreferrer'
                href={'https://docs.dify.ai/user-agreement/open-source'}
              >{t('login.license.link')}</Link>
            </div>
          </div>
        </div>
      </>
  )
}

export default InstallForm
