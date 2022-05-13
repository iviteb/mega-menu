import React from 'react'
import { ButtonWithIcon } from 'vtex.styleguide'

import IconDelete from '../../icons/IconDelete'

<<<<<<< HEAD
const UploadedBanner = ({ banner, onHandleImageReset, textlabel }) => {
  return (
    <>
      <div className="flex items-center">
        <p className="mb2">{textlabel}</p>
=======
const UploadedBanner = ({ banner, onHandleImageReset }) => {
  return (
    <>
      <div className="flex items-center">
        <p className="mb2">Uploaded banner</p>
>>>>>>> 7075498 (CU-2am52gt - [Auchan] [PR] Mega menu images)
      </div>
      <div className="flex">
        <img src={banner} alt="" width="50%" />

        <div className="pl5 ">
          <ButtonWithIcon
            icon={<IconDelete />}
            variation="danger"
            onClick={onHandleImageReset}
          />
        </div>
      </div>
    </>
  )
}

export default UploadedBanner
