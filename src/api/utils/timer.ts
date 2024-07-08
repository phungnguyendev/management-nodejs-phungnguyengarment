/* eslint-disable no-unused-vars */
export const countdownTimer = async (seconds: number): Promise<boolean> => {
  return new Promise((resolve, _reject) => {
    let remainingTime = seconds

    const timer = setInterval(() => {
      if (remainingTime <= 0) {
        clearInterval(timer)
        resolve(true)
      } else {
        console.log(`Time remaining: ${remainingTime} seconds`)
        remainingTime--
      }
    }, 1000)
  })
}

export const isExpiredDate = (expiryDate: Date): boolean => {
  const currentTime = new Date()
  return currentTime >= expiryDate
}

export const getTimeRemaining = (expiryDateString: string): number => {
  const currentTime = new Date()
  const expiryDate = new Date(expiryDateString)
  const timeRemaining = expiryDate.getTime() - currentTime.getTime() // Số milliseconds còn lại

  // Chuyển đổi số milliseconds thành số giây
  const secondsRemaining = Math.floor(timeRemaining / 1000)

  return secondsRemaining
}

// Tạo thời gian hết hạn 60 giây sau thời điểm hiện tại
export const createExpiryDate = (seconds: number = 60): Date => {
  const currentTime = new Date()
  return new Date(currentTime.getTime() + seconds * 1000)
}
