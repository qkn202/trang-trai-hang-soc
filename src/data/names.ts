import { HouseName } from '../types/game';

export const GUEST_NAMES = [
  'Minh Phù Thủy',
  'Linh Granger',
  'Khôi Potter',
  'An Lovegood',
  'Nam Diggory',
  'Thảo Weasley',
  'Bách Longbottom',
  'My Chang',
  'Hoàng Wood',
  'Ngọc Tonks',
  'Huy Scamander',
  'Châu Patil',
  'Đức Finnigan',
  'Trang Abbott',
  'Kiên Malfoy',
  'Phương Zabini',
  'Quân Thomas',
  'Vy Brown',
  'Tùng Jordan',
  'Hà Macmillan',
  'Lâm Spinnet',
  'Nhi Bell',
  'Hải Creevey',
  'Yến Clearwater',
];

export const HOUSES: HouseName[] = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];

export const HOUSE_COLORS: Record<HouseName, { primary: string; trim: string; label: string }> = {
  Gryffindor: { primary: '#b91c1c', trim: '#fbbf24', label: 'Sư Tử Đỏ Gryffindor' },
  Slytherin: { primary: '#15803d', trim: '#cbd5e1', label: 'Rắn Bạc Slytherin' },
  Ravenclaw: { primary: '#1d4ed8', trim: '#f59e0b', label: 'Đại Bàng Xanh Ravenclaw' },
  Hufflepuff: { primary: '#ca8a04', trim: '#1f2937', label: 'Lửng Vàng Hufflepuff' },
};

export const COZY_THOUGHTS = [
  { icon: '🍺', text: 'Bia Bơ nóng ở đây thơm nức mũi, uống xong ấm cả người!' },
  { icon: '🪄', text: 'Cây đũa phép Ollivanders vừa bắn ra chùm sao lấp lánh kìa!' },
  { icon: '🚂', text: 'Vừa bước xuống Tàu Tốc Hành Hogwarts đã thấy không khí phép thuật rồi!' },
  { icon: '🐾', text: 'Chú Đào Mỏ Niffler ôm đống vàng nhìn cưng xỉu... ủa ví mình đâu?' },
  { icon: '🧹', text: 'Bay trên Vòng Xoay Chổi Nimbus mát rượi như cầu thủ Quidditch!' },
  { icon: '🕯️', text: 'Những ngọn nến bay ban đêm làm công viên lung linh như cổ tích!' },
  { icon: '🍬', text: 'Kẹo ở Honeydukes ngọt lịm, mua thêm hộp Ếch Sô-cô-la mới được!' },
  { icon: '🦅', text: 'Mình vừa cúi chào chú Bằng Mã Buckbeak và được nó cúi đáp lễ!' },
];
