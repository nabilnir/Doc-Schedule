
import BookingSystem from '@/components/appointment/booking-system'
import { DoctorCard } from '@/components/appointment/doctor-card'

import React from 'react'

const page = () => {
  return (
    <div>
        <DoctorCard/>
        <BookingSystem/>
    </div>
  )
}

export default page