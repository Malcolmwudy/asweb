import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Header from '@/components/Header'
import PageWrapper from '@/components/PageWrapper'

export const metadata: Metadata = {
  title: 'Axi Select 考核助手',
  description: 'Axi Select 考核助手 - 最高百万美元资金分配 · 免费加入 · 利润分成',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <PageWrapper>
          {children}
        </PageWrapper>
        <Navigation />
        <div className="h-16"></div> {/* 为底部导航栏留出空间 */}
      </body>
    </html>
  )
}

