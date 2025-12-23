import { useState } from 'react';

import { useTheme } from '../../theme';
import { color } from '../../tokens';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';

import { gap, py } from '../../tokens/dev/utils/spacing.global.css';

/**
 * 실제 상품 상세 페이지와 유사한 레이아웃으로 디자인 시스템 컴포넌트들을 테스트합니다.
 *
 * 현재 사용 중인 컴포넌트:
 * - Button: 네비게이션, 액션 버튼, 수량 조절, 구매 버튼
 * - Text: 브랜드명, 상품명, 가격, 배송비, 라벨 등 모든 텍스트
 * - Icon: 브레드크럼 아이콘, 네비게이션 화살표
 *
 * 향후 추가 예정:
 * - Badge: 타임딜 뱃지, 할인율 뱃지
 * - Input/Select: 수량 입력, 옵션 선택
 * - 기타 완성되는 컴포넌트들
 */
export const ProductDetailPage = () => {
  const { global, components } = useTheme();
  const textTheme = components.Text;
  const buttonTheme = components.Button;

  const [quantity, setQuantity] = useState(1);
  const price = 110;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* 브레드크럼 */}
      <nav
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          alignItems: 'center',
        }}
      >
        <Icon name='tabler:home' size={16} color={color.icon.secondary} />
        <Text preset='body2' as='span' color={color.text.secondary}>
          홈
        </Text>
        <Icon name='tabler:arrow-right' size={14} color={color.icon.muted} />
        <Text preset='body2' as='span' color={color.text.secondary}>
          전자기기
        </Text>
        <Icon name='tabler:arrow-right' size={14} color={color.icon.muted} />
        <Text preset='body2' as='span' color={color.text.secondary}>
          컴퓨터
        </Text>
      </nav>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px',
        }}
      >
        {/* 왼쪽: 상품 이미지 영역 */}
        <div>
          <div
            style={{
              background: color.bg.muted,
              borderRadius: `${buttonTheme.radius ?? global.radius.sm}px`,
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              position: 'relative',
            }}
          ></div>

          {/* 썸네일 이미지 */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: '80px',
                  height: '80px',
                  background: color.bg.muted,
                  borderRadius: `${buttonTheme.radius ?? global.radius.sm}px`,
                  border:
                    i === 1
                      ? `2px solid ${textTheme.colorSchemes.brand1}`
                      : 'none',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        </div>

        {/* 오른쪽: 상품 정보 및 구매 영역 */}
        <div>
          {/* [!] 뱃지 - 타임특가*/}
          <Text preset='label1' color='brand1'>
            스토어명 Apple
          </Text>

          <Text preset='title2'>상품명 2025 맥북 프로 14 M3 PRO</Text>

          {/* 원가 */}
          <Text preset='title2' as='p'>
            2,390,000원
          </Text>

          {/* 할인률 */}
          <Text preset='title2' as='p' color='brand1'>
            10%
          </Text>

          {/* 가격 */}
          <Text preset='title2' as='p'>
            {(price * quantity).toLocaleString()}
            <Text preset='body2' as='span'>
              원
            </Text>
          </Text>

          {/* 배송비 */}
          <Text preset='body1' as='p'>
            배송비
            <Text preset='body1' as='strong'>
              3,000원
            </Text>
          </Text>

          {/* [!] 셀렉트 - 옵션 */}

          {/* 수량 선택 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid ${color.divider.default}`,
            }}
            className={py[24]}
          >
            <Text preset='body1' weight='semibold' as='span'>
              상품 금액
            </Text>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Button
                icon='tabler:minus'
                label='감소'
                variant='outline'
                size='md'
                onClick={handleDecrease}
                disabled={quantity <= 1}
              />
              <input
                type='number'
                value={quantity}
                readOnly
                style={{
                  width: '60px',
                  textAlign: 'center',
                  fontSize: '16px',
                  border: `1px solid ${color.border.default}`,
                  borderRadius: `${buttonTheme.radius ?? global.radius.sm}px`,
                  padding: '8px',
                }}
              />
              <Button
                icon='tabler:plus'
                label='증가'
                variant='outline'
                size='md'
                onClick={handleIncrease}
              />

              <Text
                preset='body1'
                weight='semibold'
                as='span'
                style={{ marginLeft: '16px' }}
              >
                {(price * quantity).toLocaleString()}원
              </Text>
            </div>
          </div>

          {/* 총 상품 금액 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid ${color.divider.default}`,
            }}
            className={py[24]}
          >
            <Text as='span'>총 수량 {quantity}개</Text>

            <Text preset='title2' color='brand1'>
              {(price * quantity).toLocaleString()}
              <Text as='span'>원</Text>
            </Text>
          </div>

          {/* 구매 버튼 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
            }}
            className={gap[4]}
          >
            <Button
              variant='outline'
              size='lg'
              color='primary'
              label='장바구니'
              icon='tabler:heart'
            />
            <Button
              size='lg'
              color='secondary'
              label='장바구니'
              leftIcon='tabler:shopping-cart'
            />
            <Button
              variant='solid'
              size='lg'
              color='primary'
              leftIcon='tabler:shopping-bag'
              label='바로 구매'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
