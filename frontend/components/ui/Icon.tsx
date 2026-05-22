import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof iconMap;

const iconMap = {
  'home': 'home-outline',
  'home-fill': 'home',
  'search': 'search-outline',
  'search-thick': 'search',
  'bookmark': 'bookmark-outline',
  'bookmark-fill': 'bookmark',
  'person': 'person-outline',
  'person-fill': 'person',
  'bell': 'notifications-outline',
  'bell-fill': 'notifications',
  'document-text': 'document-text-outline',
  'document': 'document-outline',
  'setting': 'settings-outline',
  'calendar': 'calendar-outline',
  'flag': 'flag-outline',
  'image': 'image-outline',
  'upload': 'cloud-upload-outline',
  'filter': 'options-outline',
  'share': 'share-social-outline',
  'bubble': 'chatbubble-outline',
  'folder-star': 'star-outline',
  'folder-job': 'briefcase-outline',
  'close': 'close',
  'trash': 'trash-outline',
  'refresh': 'refresh-outline',
  'send': 'send-outline',
  'message': 'mail-outline',
  'write': 'create-outline',
  'pin': 'pin-outline',
  'location': 'location-outline',
  'link': 'link-outline',
  'download': 'download-outline',
  'copy': 'copy-outline',
  'clock': 'time-outline',
  'tag': 'pricetag-outline',
  'video': 'videocam-outline',
  'attachment': 'attach-outline',
  'menu': 'menu-outline',
} as const satisfies Record<string, string>;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 20, color = '#000' }: Props) {
  const ionName = iconMap[name] as keyof typeof Ionicons.glyphMap;
  return <Ionicons name={ionName} size={size} color={color} />;
}
