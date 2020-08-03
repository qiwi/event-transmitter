import UserAgent from 'user-agents'
import { isMobile } from '../../../main/ts/utils'

interface ITestCase {
  description: string
  userAgents: string[]
  expected: boolean[]
}

const testCasesCount = 100

const checkTestCase = (functionToTest: (ua: string) => boolean) =>
  ({ description, userAgents, expected }: ITestCase) => {
    describe(description, () => {
      userAgents.forEach((userAgent, i) => {
        test(userAgent, () => expect(functionToTest(userAgent)).toEqual(expected[i]))
      })
    })
  }

const mobileUaFactory = new UserAgent({ deviceCategory: 'mobile' }).random
const desktopUaFactory = new UserAgent({ deviceCategory: 'desktop' }).random
const tabletUaFactory = new UserAgent({ deviceCategory: 'tablet' }).random

const mobileUserAgents = [...new Array(testCasesCount)].map(() => mobileUaFactory().data.userAgent)
const desktopUserAgents = [...new Array(testCasesCount)].map(() => desktopUaFactory().data.userAgent)
const tabletUserAgents = [...new Array(testCasesCount)].map(() => tabletUaFactory().data.userAgent)

describe('isMobile', () => {
  const testCases: ITestCase[] = [
    {
      description: 'returns true for all mobile userAgents',
      userAgents: mobileUserAgents,
      expected: new Array(testCasesCount).fill(true),
    },
    {
      description: 'returns false for all desktop userAgents',
      userAgents: desktopUserAgents,
      expected: new Array(testCasesCount).fill(false),
    },
    {
      description: 'returns true for all tablet userAgents',
      userAgents: tabletUserAgents,
      expected: new Array(testCasesCount).fill(true),
    },
  ]

  testCases.forEach(checkTestCase(isMobile))
})
