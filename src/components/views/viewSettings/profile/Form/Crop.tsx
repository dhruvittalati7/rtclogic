import React, { useState } from 'react'
import styles from './Crop.module.scss'
import AvatarEditor from 'react-avatar-editor'
import { FormFieldSubmit } from 'src/components/shared/ui/form/formField/Submit'

interface Props {
  src: string
  onApply: (base64: string) => void
}

export const Crop = ({ src, onApply }: Props) => {
  const [ref, setRef] = useState<AvatarEditor | null>()
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0.5, y: 0.5 })

  const onClickApply = () => {
    if (ref) {
      const img = ref.getImageScaledToCanvas().toDataURL('image/jpeg', 1)
      onApply(img)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.cropAreaWrapper}>
        <AvatarEditor
          image={src}
          width={160}
          height={160}
          border={1}
          color={[255, 255, 255, 0.6]}
          scale={scale}
          position={position}
          onPositionChange={setPosition}
          rotate={0}
          borderRadius={160}
          className={styles.cropArea}
          ref={n => setRef(n)}
        />
      </div>
      <div>
        <input
          name="scale"
          type="range"
          onChange={e => {
            setScale(parseFloat(e.target.value))
          }}
          min={1}
          max={2}
          step="0.01"
          value={scale}
        />
      </div>
      <FormFieldSubmit className={styles.applyBtn} onClick={onClickApply}>
        Apply
      </FormFieldSubmit>
    </div>
  )
}
