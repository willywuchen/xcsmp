/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Circle, 
  History, 
  Star, 
  Sparkles,
  Share2, 
  Phone, 
  LayoutGrid, 
  Send, 
  Plus, 
  CheckCircle2,
  Award,
  ChevronRight,
  User,
  ShoppingBag,
  MessageSquare,
  Search,
  ShoppingCart,
  X,
  Trash2,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// AI initialization removed from top level to avoid API key error at startup
// Only initialize if needed inside specific functions

const DynamicItem = ({ image, title, date, likes, onClick }: { image: string, title: string, date?: string, likes?: number, onClick?: () => void, key?: any }) => (
  <div 
    onClick={onClick}
    className="min-w-[120px] bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
  >
    <img src={image} alt={title} className="w-full h-24 object-cover" referrerPolicy="no-referrer" />
    <div className="p-2">
      <p className="text-[10px] text-gray-700 font-bold line-clamp-1">{title}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[8px] text-gray-400">{date}</span>
        <div className="flex items-center gap-0.5 text-[8px] text-gray-400">
          <Heart className="w-2 h-2" />
          <span>{likes ?? 0}</span>
        </div>
      </div>
    </div>
  </div>
);

const ProductItem = ({ image, name, price }: { image: string, name: string, price: string }) => (
  <div className="min-w-[100px] flex flex-col gap-1">
    <img src={image} alt={name} className="w-full h-24 rounded-xl object-cover border border-gray-100" referrerPolicy="no-referrer" />
    <p className="text-[10px] text-gray-800 font-bold truncate">{name}</p>
    <p className="text-[10px] text-orange-500 font-bold">{price}</p>
  </div>
);

const ReviewItem = ({ avatar, author, time, content }: { avatar: string, author: string, time: string, content: string }) => (
  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 mb-2 last:mb-0">
    <div className="flex items-center gap-2 mb-1.5">
      <img src={avatar} alt={author} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-bold text-gray-800">{author}</span>
          <span className="text-[9px] text-gray-400">{time}</span>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
    </div>
    <p className="text-[11px] text-gray-700 leading-relaxed">{content}</p>
  </div>
);

const RateForm = ({ name }: { name: string }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-gray-800">评价提交成功</p>
        <p className="text-xs text-gray-500">感谢您的反馈！</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-2 py-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star} 
            onClick={() => setRating(star)}
            className="transition-transform active:scale-125"
          >
            <Star className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          </button>
        ))}
      </div>
      <textarea 
        placeholder={`写下您对${name}评价吧...`}
        className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs outline-none focus:border-blue-300 transition-colors resize-none h-20"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button 
        onClick={() => rating > 0 && setSubmitted(true)}
        disabled={rating === 0}
        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${rating > 0 ? 'bg-blue-500 text-white active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      >
        提交评价
      </button>
    </div>
  );
};

const RouteItem = ({ image, title, price }: { image: string, title: string, price: string }) => (
  <div className="min-w-[140px] bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
    <img src={image} alt={title} className="w-full h-24 object-cover" referrerPolicy="no-referrer" />
    <div className="p-2">
      <p className="text-[11px] text-gray-800 font-bold line-clamp-1 mb-1">{title}</p>
      <p className="text-[12px] text-orange-500 font-bold">{price}</p>
    </div>
  </div>
);

const dynamics = [
  {
    id: 'd1',
    title: '金海雪山春日漫游',
    date: '4月30日',
    likes: 128,
    images: [
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=600'
    ],
    content: `金海雪山春日漫游🌼宫崎骏动漫世界照进现实
贵定金海雪山也太美了
油菜花的「金海」配漫山酥李花的「雪山」
真的可以感受一万次贵州的春和景明
花海骑行🚲吹着春风超惬意，花野市集逛吃打卡
还有花田音乐会🎼，边听歌边赏花海，幸福感爆棚
📸【绝美打卡机位&游玩体验】
▫️花海中的巨型相框+艺术门
站在里面拍超出片，画面超治愈❤️🩹
▫️花海观景台（油菜花田外山坡上）
俯瞰整片金色花海，🚂小火车经过简直动漫感十足
还可以花海骑行🚲路过这里拍动态感拉满[色色R]
▫️翁城河旁
这里可以体验竹筏🚣拍油菜花和竹筏同框照🌼
▫️花海小火车
穿梭在金色花田，随手拍都是日系清新大片`
  },
  {
    id: 'd2',
    title: '西江千户苗寨夜景',
    date: '4月28日',
    likes: 356,
    isVideo: true,
    images: ['https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=600'],
    content: `西江千户苗寨的夜景确实封神
🏮“当夜幕降临，万盏明灯亮起，这里便是神隐的世界。” 这里是《100个国内小众旅游城市》第 31 站——贵州·西江千户苗寨。
	
很多人说它商业化，但作为全世界最大的苗族聚居村寨，那种依山而建、层层叠叠的吊脚楼群，依然能给人巨大的视觉冲击。尤其是晚上7点半，当千户灯火瞬间亮起，满山繁星坠落，像极了《千与千寻》里的汤屋。在这里，你可以穿上一套苗族盛装，戴上银饰，做一天苗疆少女；也可以去体验最霸道的“高山流水”拦门酒。建议游玩 2天1晚。
	
🎒 行前必看
心态：确实商业化，人也多，但把它当成一个成熟的“苗族文化博物馆”去逛，体验会好很多。
交通：高铁直达“凯里南站”，出站就有直通车去景区（约50分钟）。
住宿：这是一个巨大的坑！ 千万别带大行李箱住半山腰！青石板路+爬坡会让你怀疑人生。建议行李寄存在山脚，轻装上阵，或者住在山脚平地。
	
🗺️ 2天1晚·苗疆寻梦
Day 1：高山流水与万家灯火 抵达景区北门，先体验苗族最高礼遇——十二道拦门酒。进入寨子后，穿上租来的苗服（满大街都是，一定要砍价），在风雨桥边拍照，出片率100%。傍晚坐观光车去 观景台，占据有利位置等待亮灯。当星星点点的灯光连成一片火海，那种震撼会让你忘记拥挤。
Day 2：晨雾与烟火 早起！清晨的苗寨是最美的。晨雾缭绕在吊脚楼间，炊烟升起，褪去了夜晚的喧嚣。去逛逛 嘎歌古巷，看银饰锻造和蜡染技艺。中午去体验一次 长桌宴，虽然是表演性质，但那种“高山流水”灌酒的场面真的很有趣。
	
🥘 必吃清单（酸汤是灵魂）
酸汤鱼：贵州菜的代表！红酸汤开胃，鱼肉鲜嫩，蘸着折耳根辣椒水，连喝三碗汤不夸张。
长桌宴：主要是吃氛围，几十个人坐一桌，阿妹唱着歌来敬酒。
黑毛猪肉串：路边摊随处可见，肉质很香。
糯米饭：五彩斑斓的糯米饭，软糯香甜。
	
⚠️ 避坑Tips
关于租衣服：货比三家！含妆造一般50-100元，记得问清楚限时不限时。
观景台：晚上观景台回程的观光车排队极长！如果体力允许，建议走步道下山，也就15-20分钟。
蚊虫：山区蚊虫多且毒，防蚊喷雾随身带。`
  },
  {
    id: 'd3',
    title: '梵净山云海奇观',
    date: '4月25日',
    likes: 212,
    images: ['https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&q=80&w=600'],
    content: '梵净山，天空之城。在这里感受大自然的鬼斧神工，洗涤心灵。'
  },
  {
    id: 'd4',
    title: '荔波小七孔自然风光',
    date: '4月20日',
    likes: 452,
    images: ['https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=80&w=600'],
    content: '荔波小七孔，地球腰带上的绿宝石。清澈见底的湖水，如诗如画。'
  }
];

const products = [
  { 
    id: '1', 
    name: '黄果树-西江-荔波三日游', 
    price: '¥1299', 
    category: '旅游线路', 
    image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=400', 
    description: '【行程规划师定制】精选贵州黄金三天两夜：第一天深度探秘亚洲第一大瀑布——黄果树瀑布；第二天漫步西江千户苗寨，看万家灯火，赏苗族歌舞；第三天邂逅地球腰带上的绿宝石——小七孔。全程行程规划师大明带您深度体验，尊享高标准住宿，带您领略地道的自然风光与历史人文。' 
  },
  { id: '2', name: '荔波一日游', price: '¥399', category: '旅游线路', image: 'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=80&w=400', description: '感受地球腰带上的绿宝石，荔波小七孔自然风光精华。' },
  { id: '3', name: '贵阳Citywalk一日游', price: '¥199', category: '旅游线路', image: 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=400', description: '漫步贵阳老街，寻味地道美食，感受黔城生活气息。' },
  { id: '4', name: '马尾绣耳环', price: '¥128', category: '手工艺品', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=400', description: '指尖上的非遗，精美水族马尾绣工艺。' },
  { id: '5', name: '蜡染桌布', price: '¥88', category: '手工艺品', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400', description: '传统苗族蜡染，自然植物染色。' },
  { id: '6', name: '贵州三宝', price: '¥299', category: '特色食品', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400', description: '天麻、杜仲、灵芝，贵州地道滋补佳品。' },
  { id: '101', name: '【AI定制】贵州深度游', price: '¥2599', category: '定制线路', image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=400', description: '这是AI根据您的需求为您量身定制的专属行程。涵盖了您偏好的所有目的地和游玩风格。' }
];

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [showDynamics, setShowDynamics] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [activeCards, setActiveCards] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<{type: 'user' | 'bot', content: string | React.ReactNode}[]>([]);
  
  // New States
  const [secondaryPage, setSecondaryPage] = useState<'none' | 'service_list' | 'product_detail' | 'cart' | 'checkout' | 'success' | 'dynamics_list' | 'dynamic_detail'>('none');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedDynamic, setSelectedDynamic] = useState<any>(null);
  const [floatingNote, setFloatingNote] = useState<any>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [cart, setCart] = useState<any[]>([]);
  const [companyInfo, setCompanyInfo] = useState<string>('');
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [remarks, setRemarks] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

  // AI Customizer States
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    duration: '3天',
    companions: '朋友出行',
    style: '经典必去',
    phoneNumber: '13984848484'
  });

  const servicesRef = React.useRef<HTMLDivElement>(null);

  const openProductDetail = (productId: string, customTitle?: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct({ ...product, isCustom: productId === '101' });
      setSecondaryPage('product_detail');
    }
  };

  const handleAiSubmit = () => {
    setShowCustomizer(false);
    
    // Add user message to chat as a requirement card
    setChatHistory(prev => [...prev, { 
      type: 'user', 
      content: (
        <div className="bg-white/10 p-3 rounded-xl space-y-1">
          <p className="font-bold text-xs border-b border-white/20 pb-1 mb-2">📋 行程定制需求表</p>
          <div className="grid grid-cols-2 gap-y-2 text-[11px]">
            <div className="text-white/60">游玩天数：</div>
            <div>{aiConfig.duration}</div>
            <div className="text-white/60">同行伙伴：</div>
            <div>{aiConfig.companions}</div>
            <div className="text-white/60">风格偏好：</div>
            <div>{aiConfig.style}</div>
            <div className="text-white/60">联系电话：</div>
            <div>{aiConfig.phoneNumber}</div>
          </div>
        </div>
      )
    }]);

    // Bot response start
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        content: "精彩旅程规划中...🚀" 
      }]);
      setIsPlanning(true);

      // Final recommendation after 5s
      setTimeout(() => {
        setIsPlanning(false);
        const aiProduct = products.find(p => p.id === '101');
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          content: (
            <div className="space-y-3">
              <p>✨ 规划完成！根据您的偏好，大明为您特别推荐以下专属定制路线：</p>
              <div 
                className="cursor-pointer active:scale-95 transition-transform" 
                onClick={() => openProductDetail('101')}
              >
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <img src={aiProduct?.image} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <p className="text-sm font-bold text-gray-800">{aiProduct?.name}</p>
                    <p className="text-base font-bold text-orange-500 mt-1">{aiProduct?.price}</p>
                    <p className="text-[10px] text-gray-400 mt-2">包含专属AI路线规划详情，支持在线预订。</p>
                  </div>
                </div>
              </div>
                <button 
                  onClick={() => window.location.href = `tel:${aiConfig.phoneNumber}`}
                className="w-full py-2 bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                拨打您的电话详谈
              </button>
            </div>
          )
        }]);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 5000);
    }, 600);
  };

const handleCompanyClick = () => {
    if (companyInfo) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      return;
    }
    setLoadingCompany(true);
    triggerCard('company_intro');
    
    // 直接返回预设的公司介绍内容，不再调用AI
    setTimeout(() => {
      const content = `公司介绍
中国国旅（贵州）国际旅行社有限公司（以下简称“国旅贵州公司”）是中国旅游集团旗下中国国际旅行社总社有限公司在贵州设立的重要分支机构。以下从规模、主要业务和优势三个方面为您介绍：

1. 企业规模与背景
国旅贵州公司成立于2011年，总部位于贵阳市，注册资本300万元人民币。作为中国国旅（CITS）全国网络的重要组成部分，它依托中国旅游集团这一中央企业的强大背景，共享集团在全球12个国家和全国范围内的经营网络。公司在贵州本地拥有完善的组织架构，并设有多个营业部，是贵州省内具有显著品牌影响力的高标准国际旅行社。

2. 主要业务范围
公司业务涵盖了全方位的旅游产业链，主要包括：
* 出入境旅游： 组织中国公民赴境外旅游（出境游）及接待海外游客赴黔观光（入境游）。
* 国内及地方旅游： 专注贵州省内精品线路开发，如黄果树、西江千户苗寨、梵净山等核心景区的深度游。
* 商务会奖（MICE）： 承接国内外大中型会议、展览、商务考察及企业团建活动。
* 定制化服务： 提供高端定制游、研学旅行、自驾游以及航空票务和代办签证等一站式旅游配套服务。

3. 核心竞争优势
* 品牌背书： “中国国旅”是中国旅游业最具价值的品牌之一。公司严格执行国旅总社的服务标准，具备极高的行业公信力和安全保障。
* 资源网络： 依托集团优势，能够获取更具竞争力的机票、酒店及景区资源价格，且在旅游高峰期具备更强的控票和接待能力。
* 专业化团队： 拥有一支经验丰富、多语种的专业导游和领队队伍，服务流程规范化，能够提供标准化且兼具地方特色的高品质旅游体验。
* 本地化深度经营： 深入整合贵州喀斯特地貌与民族文化资源，擅长打造“山水+民俗”的特色产品，在地方接待 and 应急保障方面具有丰富经验。`;
      
      setCompanyInfo(content);
      setLoadingCompany(false);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }, 800);
  };

  const addToCart = (product: any) => {
    setCart(prev => [...prev, { ...product, cartId: Math.random().toString(36).substr(2, 9) }]);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setChatHistory(prev => [...prev, { type: 'user', content: userMsg }]);
    setInputValue('');

    // Bot Logic
    setTimeout(() => {
      if (userMsg === '你好') {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          content: "您好，你好！👋 我是行程规划师大明。欢迎来到多彩贵州！🌟 我可以带你游览各大景区，在大街小巷中寻找美食，体验贵州特色文化！有啥需求直接给我说。😊" 
        }]);
      } else if (userMsg.includes('服务') && userMsg.includes('收费')) {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          content: (
            <div className="space-y-3">
              <p>亲，贵州的旅游线路非常丰富，这里为您推荐三条最热门的路线。具体收费标准如下，您可以参考哦！👇</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                <RouteItem 
                  image="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=400" 
                  title="贵阳Citywalk一日游" 
                  price="¥199/人" 
                />
                <RouteItem 
                  image="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400" 
                  title="黄果树瀑布一日游" 
                  price="¥499/人" 
                />
                <RouteItem 
                  image="https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=80&w=400" 
                  title="小七孔一日游" 
                  price="¥399/人" 
                />
              </div>
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <p className="text-[11px] text-blue-700 mb-2 font-medium">💡 提示：价格包含导游及行程规划费。如需定制私人行程，欢迎直接拨打我的电话详谈！</p>
                <a 
                  href="tel:18585866935" 
                  className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>拨打电话咨询</span>
                </a>
              </div>
            </div>
          )
        }]);
      } else {
        setChatHistory(prev => [...prev, { 
          type: 'bot', 
          content: "收到您的消息啦！如果您想了解我的动态、评价或服务，可以直接点击上方的图标，或者点击下方的“联系我”直接给我打电话哦！📞" 
        }]);
      }
      
      // Scroll to bottom
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }, 600);
  };

  const triggerCard = (type: string) => {
    if (!activeCards.includes(type)) {
      setActiveCards(prev => [...prev, type]);
      // Scroll to bottom
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  };

  useEffect(() => {
    const dynamicsTimer = setTimeout(() => setShowDynamics(true), 1000);
    const productsTimer = setTimeout(() => setShowProducts(true), 2000);
    
    return () => {
      clearTimeout(dynamicsTimer);
      clearTimeout(productsTimer);
    };
  }, []);

  useEffect(() => {
    if (showProducts) {
      const scrollTimer = setTimeout(() => {
        if (servicesRef.current) {
          servicesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1000);
      return () => clearTimeout(scrollTimer);
    }
  }, [showProducts]);

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-sans text-[#333] pb-40">
      {/* Top Background & Header */}
      <div className="relative h-44 w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&q=80&w=1000" 
          alt="Scenic Background" 
          className="w-full h-full object-cover brightness-75 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center text-white">
          <ChevronLeft className="w-6 h-6" />
          <div className="flex items-center gap-4">
            <MoreHorizontal className="w-6 h-6" />
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <Circle className="w-3 h-3 fill-white" />
            </div>
          </div>
        </div>
        
        {/* Header Actions */}
        <div className="absolute bottom-10 right-4 flex items-center gap-4 text-white/90 text-xs">
          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
            <Star className="w-3.5 h-3.5" />
            <span>收藏名片</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            <span>分享名片</span>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[32px] p-5 shadow-xl shadow-blue-500/5 border border-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" 
                alt="Avatar" 
                className="w-20 h-20 rounded-[24px] object-cover border-2 border-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-0.5">
                <h1 className="text-xl font-bold text-gray-900">李大明</h1>
                <div className="mt-0.5">
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider">行程规划师</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 group cursor-pointer whitespace-nowrap overflow-hidden" onClick={handleCompanyClick}>
                <p className="text-[10px] text-gray-400 font-medium truncate">中国国旅 (贵州) 国际旅行社有限公司</p>
                <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="px-4 py-8 space-y-6">
        <div className="flex items-start gap-2">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
            alt="Mini Avatar" 
            className="w-8 h-8 rounded-full object-cover shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="bg-white text-gray-700 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm border border-gray-50 max-w-[85%] leading-relaxed text-sm">
            你好！我是中国国旅 (贵州) 国际旅行社有限公司行程规划师大明。欢迎来到多彩贵州！咱们计划玩个几天呀，我根据您的时间安排来介绍最舒服的游玩路线，现在咱们刚好有活动价格非常优惠~
          </div>
        </div>

        {/* Exciting Dynamics */}
        <AnimatePresence>
          {showDynamics && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2"
            >
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
                alt="Mini Avatar" 
                className="w-8 h-8 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-50 max-w-[85%]">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-bold text-gray-800">精彩动态</span>
                  <button 
                    onClick={() => setSecondaryPage('dynamics_list')}
                    className="flex items-center text-[10px] text-blue-500"
                  >
                    <span>更多</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mb-2">这是我为您精选的贵州必打卡美景，每一处都值得您亲自去感受。</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {dynamics.map(item => (
                    <DynamicItem 
                      key={item.id}
                      image={item.images[0]} 
                      title={item.title} 
                      date={item.date}
                      likes={item.likes}
                      onClick={() => {
                        setSelectedDynamic(item);
                        setCurrentImgIndex(0);
                        setIsContentExpanded(false);
                        setSecondaryPage('dynamic_detail');
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guizhou Products */}
        <AnimatePresence>
          {showProducts && (
            <motion.div 
              ref={servicesRef}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2"
            >
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
                alt="Mini Avatar" 
                className="w-8 h-8 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-50 max-w-[85%]">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-bold text-gray-800">精选橱窗</span>
                  <button 
                    onClick={() => setSecondaryPage('service_list')}
                    className="flex items-center text-[10px] text-blue-500"
                  >
                    <span>更多</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mb-2">精选贵州品质线路及商品，游贵州大好河山，留美好回忆。</p>
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  <div className="cursor-pointer active:scale-95 transition-transform" onClick={() => openProductDetail('1')}>
                    <ProductItem 
                      image="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=400" 
                      name="黄果树-西江-荔波三日游" 
                      price="¥1299" 
                    />
                  </div>
                  <div className="cursor-pointer active:scale-95 transition-transform" onClick={() => openProductDetail('2')}>
                    <ProductItem 
                      image="https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=80&w=400" 
                      name="荔波一日游" 
                      price="¥399" 
                    />
                  </div>
                  <div className="cursor-pointer active:scale-95 transition-transform" onClick={() => openProductDetail('6')}>
                    <ProductItem 
                      image="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400" 
                      name="贵州三宝" 
                      price="¥299" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Custom Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="relative group cursor-pointer max-w-[85%] w-full ml-auto"
          onClick={() => setShowCustomizer(true)}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-[28px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative bg-white rounded-[28px] p-4 shadow-lg border border-blue-50/50 overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-40"></div>
            
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-200 shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-base font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI 定制线路</span>
                  <p className="text-[10px] text-gray-400 font-medium">专属您的定制旅行专家</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 whitespace-nowrap">免费定制</div>
                <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Chat History */}
        {chatHistory.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {msg.type === 'bot' ? (
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
                alt="Mini Avatar" 
                className="w-8 h-8 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                ME
              </div>
            )}
            <div className={`${msg.type === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white text-gray-700 rounded-tl-none border border-gray-50'} px-4 py-2 rounded-2xl shadow-sm max-w-[85%] leading-relaxed text-sm`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {/* Triggered Cards */}
        {activeCards.map((cardType, index) => (
          <motion.div 
            key={`${cardType}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-2"
          >
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" 
              alt="Mini Avatar" 
              className="w-8 h-8 rounded-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
            
            {cardType === 'contact' && (
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-50 max-w-[85%] w-full">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-gray-800">联系李大明</span>
                </div>
                <p className="text-[11px] text-gray-600 mb-3">您可以随时拨打我的电话，大明将为您提供最专业的贵州旅行建议。</p>
                <a 
                  href="tel:18585866935" 
                  className="flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>立即拨打电话</span>
                </a>
              </div>
            )}

            {cardType === 'dynamics' && (
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-50 max-w-[85%] w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-gray-800">精彩动态</span>
                  </div>
                  <button className="text-[10px] text-blue-500 flex items-center">
                    <span>更多</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mb-2">这是我为您精选的贵州必打卡美景。</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  <DynamicItem 
                    image="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400" 
                    title="感受春天的气息" 
                  />
                  <DynamicItem 
                    image="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=400" 
                    title="西江千户苗寨夜景" 
                  />
                  <DynamicItem 
                    image="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&q=80&w=400" 
                    title="梵净山云海奇观" 
                  />
                </div>
              </div>
            )}

            {cardType === 'services' && (
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-50 max-w-[85%] w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-gray-800">精选橱窗</span>
                  </div>
                  <button 
                    onClick={() => setSecondaryPage('service_list')}
                    className="text-[10px] text-blue-500 flex items-center"
                  >
                    <span>更多</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mb-2">精选贵州品质线路及商品，游贵州大好河山，留美好回忆。</p>
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  <div className="cursor-pointer active:scale-95 transition-transform" onClick={() => openProductDetail('1')}>
                    <ProductItem 
                      image="https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?auto=format&fit=crop&q=80&w=400" 
                      name="黄果树-西江-荔波三日游" 
                      price="¥1299" 
                    />
                  </div>
                  <div className="cursor-pointer active:scale-95 transition-transform" onClick={() => openProductDetail('2')}>
                    <ProductItem 
                      image="https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&q=80&w=400" 
                      name="荔波一日游" 
                      price="¥399" 
                    />
                  </div>
                  <div className="cursor-pointer active:scale-95 transition-transform" onClick={() => openProductDetail('6')}>
                    <ProductItem 
                      image="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=400" 
                      name="贵州三宝" 
                      price="¥299" 
                    />
                  </div>
                </div>
              </div>
            )}

            {cardType === 'reviews' && (
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-50 max-w-[85%] w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-bold text-gray-800">我的评价</span>
                  </div>
                  <button className="text-[10px] text-blue-500 flex items-center">
                    <span>更多</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-1">
                  <ReviewItem 
                    avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100"
                    author="张女士" 
                    time="2024-03-10"
                    content="小王导游非常专业，讲解生动有趣，对当地文化了解极深！" 
                  />
                  <ReviewItem 
                    avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
                    author="李先生" 
                    time="2024-03-08"
                    content="行程安排得非常合理，完全没有购物陷阱，玩得很开心。" 
                  />
                  <ReviewItem 
                    avatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
                    author="王同学" 
                    time="2024-03-05"
                    content="不仅是导游，更像是带路的好朋友，强烈推荐！" 
                  />
                </div>
              </div>
            )}

            {cardType === 'rate_me' && (
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-50 max-w-[85%] w-full">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold text-gray-800">评价李大明</span>
                </div>
                <RateForm name="李大明" />
              </div>
            )}

            {cardType === 'company_intro' && (
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-50 max-w-[85%] w-full">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-gray-800">公司介绍</span>
                </div>
                {loadingCompany ? (
                  <div className="flex flex-col items-center py-4 gap-2">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] text-gray-400">AI 正在为您检索公司信息...</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{companyInfo}</p>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 px-4 pt-3 pb-6 z-50">
        {/* Floating Note above input */}
        <AnimatePresence>
          {floatingNote && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex items-center gap-3"
            >
              <img src={floatingNote.images[0]} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800">刚刚浏览的笔记</p>
                <p className="text-[10px] text-gray-400 truncate">{floatingNote.title} | {floatingNote.content.substring(0, 20)}...</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const noteContent = `我对这个动态很感兴趣：${floatingNote.title}`;
                    setChatHistory(prev => [...prev, { type: 'user', content: noteContent }]);
                    setFloatingNote(null);
                    
                    // Bot response
                    setTimeout(() => {
                      setChatHistory(prev => [...prev, { 
                        type: 'bot', 
                        content: (
                          <div className="space-y-3">
                            <p>金海雪山真的很美，花都绽放开了，特别适合5月份游玩，可以联系我，详细给你介绍哦。</p>
                            <button 
                              onClick={() => window.location.href = 'tel:18585866935'}
                              className="mt-2 flex items-center justify-center gap-2 bg-blue-500 text-white text-[11px] px-4 py-2 rounded-lg active:scale-95 transition-all shadow-sm"
                            >
                              <Phone className="w-3 h-3" />
                              <span>联系我</span>
                            </button>
                          </div>
                        )
                      }]);
                    }, 800);
                  }}
                  className="bg-pink-50 text-pink-500 px-3 py-1.5 rounded-full text-[10px] font-bold active:scale-95 transition-transform"
                >
                  发送
                </button>
                <button onClick={() => setFloatingNote(null)} className="p-1">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar py-1">
          <button 
            onClick={() => triggerCard('contact')}
            className="flex items-center gap-1.5 bg-white border border-blue-100 text-blue-600 px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm active:bg-blue-50 whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>联系我</span>
          </button>
          <button 
            onClick={() => setSecondaryPage('service_list')}
            className="flex items-center gap-1.5 bg-white border border-amber-100 text-amber-600 px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm active:bg-amber-50 whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>精选橱窗</span>
          </button>
          <button 
            onClick={() => setShowCustomizer(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-transform whitespace-nowrap"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>AI线路定制</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#F5F7FA] rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <input 
              type="text" 
              placeholder="向大明提问..." 
              className="bg-transparent border-none outline-none flex-1 text-sm text-gray-700"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} disabled={!inputValue.trim()}>
              <Send className={`w-5 h-5 transition-colors ${inputValue ? 'text-blue-500' : 'text-blue-300'}`} />
            </button>
          </div>
          <button className="w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Floating Cart Button (Moved to service list but conditional logic handles it inside overlay now) */}
      
      {/* Secondary Page Overlay */}
      <AnimatePresence>
        {secondaryPage !== 'none' && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#F7F8FA] z-[100] flex flex-col"
          >
            {/* Header */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 shrink-0">
              <button 
                onClick={() => {
                  if (secondaryPage === 'product_detail') {
                    if (selectedProduct?.isCustom) setSecondaryPage('none');
                    else setSecondaryPage('service_list');
                    setSelectedProduct(null);
                  }
                  else if (secondaryPage === 'checkout') setSecondaryPage('product_detail');
                  else if (secondaryPage === 'success') setSecondaryPage('none');
                  else if (secondaryPage === 'dynamic_detail') {
                    setSecondaryPage(selectedDynamic?.fromList ? 'dynamics_list' : 'none');
                  }
                  else {
                    setSecondaryPage('none');
                  }
                }} 
                className="p-1"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-sm font-bold">
                {secondaryPage === 'service_list' && '精选橱窗'}
                {secondaryPage === 'product_detail' && (selectedProduct?.isCustom ? '线路详情' : '商品详情')}
                {secondaryPage === 'cart' && '购物车'}
                {secondaryPage === 'checkout' && '确认订单'}
                {secondaryPage === 'success' && '支付成功'}
                {secondaryPage === 'dynamics_list' && '精彩动态'}
                {secondaryPage === 'dynamic_detail' && '动态详情'}
              </h2>
              <div className="w-8" />
            </div>

            <div className="flex-1 relative overflow-hidden">
              {secondaryPage === 'service_list' && (
                <div className="absolute inset-0 overflow-y-auto no-scrollbar">
                  <div className="p-4 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="检索路线或产品..."
                        className="w-full bg-white border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-300 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                      {['全部', '旅游线路', '特色食品', '手工艺品'].map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 border border-gray-100'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 gap-3 pb-20">
                      {products
                        .filter(p => (selectedCategory === '全部' || p.category === selectedCategory) && p.name.includes(searchQuery))
                        .map(product => (
                          <div 
                            key={product.id}
                            onClick={() => { setSelectedProduct(product); setSecondaryPage('product_detail'); }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 active:scale-[0.98] transition-transform"
                          >
                            <img src={product.image} alt={product.name} className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
                            <div className="p-3">
                              <h3 className="text-xs font-bold text-gray-800 line-clamp-1 mb-1">{product.name}</h3>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-orange-500">{product.price}</span>
                                <Plus className="w-4 h-4 text-blue-500" />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  {/* Floating Cart Button (Home for cart now) */}
                  <button 
                    onClick={() => setSecondaryPage('cart')}
                    className="fixed right-6 bottom-10 w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg z-[110] active:scale-95 transition-transform"
                  >
                    <ShoppingCart className="w-7 h-7" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-bold">
                        {cart.length}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {secondaryPage === 'product_detail' && selectedProduct && (
                <div className="absolute inset-0 flex flex-col bg-white overflow-hidden">
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="relative">
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
                      <button 
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase font-bold">{selectedProduct.category}</span>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            <span>官方保证</span>
                          </div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mt-2">{selectedProduct.name}</h2>
                        <p className="text-2xl font-bold text-orange-500 mt-1">{selectedProduct.price}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-800">服务说明</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{selectedProduct.description}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2">包含服务</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['金牌导游讲解', '全程舒适巴士', '门票保险', '特色午餐'].map(item => (
                            <div key={item} className="flex items-center gap-1.5">
                              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                              <span className="text-[10px] text-gray-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100 flex gap-3 bg-white">
                    <button 
                      onClick={() => {
                        if (selectedProduct.isCustom) {
                          window.location.href = 'tel:13800138000';
                        } else {
                          addToCart(selectedProduct); 
                          alert('已加入购物车');
                        }
                      }}
                      className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl text-xs font-bold active:scale-95 transition-transform"
                    >
                      {selectedProduct.isCustom ? '联系规划师' : '加入购物车'}
                    </button>
                    <button 
                      onClick={() => { setRemarks(''); setSecondaryPage('checkout'); }}
                      className="flex-1 bg-blue-500 text-white py-3 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-transform"
                    >
                      立即购买
                    </button>
                  </div>
                </div>
              )}

              {secondaryPage === 'checkout' && selectedProduct && (
                <div className="absolute inset-0 flex flex-col bg-[#F7F8FA] overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex gap-4">
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{selectedProduct.name}</p>
                        <p className="text-lg font-bold text-orange-500">{selectedProduct.price}</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-gray-800">出行备注</h4>
                        <textarea 
                          placeholder="请填写旅行时间（如：2024-05-01）和其他特殊需求..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs outline-none focus:border-blue-300 transition-colors h-24 resize-none"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </div>
                      <div className="space-y-4 pt-2 border-t border-gray-50">
                        <h4 className="text-xs font-bold text-gray-800">支付方式</h4>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                          <div className="flex items-center gap-2">
                            <img src="https://img.icons8.com/color/48/000000/weixing.png" className="w-5 h-5" alt="WeChat Pay" />
                            <span className="text-xs font-medium text-green-700">微信支付</span>
                          </div>
                          <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500 font-medium">实付款</span>
                      <span className="text-2xl font-bold text-orange-500">{selectedProduct.price}</span>
                    </div>
                    <button 
                      onClick={() => setSecondaryPage('success')}
                      className="w-full bg-blue-500 text-white py-4 rounded-2xl text-base font-bold shadow-lg active:scale-95 transition-transform"
                    >
                      确认支付
                    </button>
                  </div>
                </div>
              )}

              {secondaryPage === 'success' && (
                <div className="absolute inset-0 p-10 flex flex-col items-center justify-start h-full pt-20 bg-white overflow-y-auto">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">支付成功</h3>
                  <p className="text-xs text-gray-400 mb-10 text-center">您的订单已预约成功，规划师大明将尽快联系您</p>
                  
                  <div className="w-full space-y-3">
                    <button 
                      onClick={() => { alert('跳转至订单页...'); setSecondaryPage('none'); }}
                      className="w-full bg-blue-500 text-white py-3 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-transform"
                    >
                      进入订单页查看
                    </button>
                    <button 
                      onClick={() => setSecondaryPage('service_list')}
                      className="w-full bg-gray-50 text-gray-500 py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                    >
                      返回我的服务
                    </button>
                  </div>
                </div>
              )}

              {secondaryPage === 'cart' && (
                <div className="absolute inset-0 flex flex-col bg-[#F7F8FA] overflow-hidden">
                  {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                      <ShoppingBag className="w-12 h-12 opacity-20" />
                      <p className="text-xs">购物车是空的，快去选购吧</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                        {cart.map((item) => (
                          <div key={item.cartId} className="bg-white p-3 rounded-2xl flex gap-3 border border-gray-50 shadow-sm">
                            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div>
                                <h3 className="text-xs font-bold text-gray-800">{item.name}</h3>
                                <p className="text-[10px] text-gray-400">{item.category}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-orange-500">{item.price}</span>
                                <button onClick={() => removeFromCart(item.cartId)} className="text-gray-300 hover:text-red-500">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white p-4 border-t border-gray-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">共 {cart.length} 件商品</span>
                          <span className="text-lg font-bold text-orange-500">合计: ¥{cart.reduce((acc, curr) => acc + parseInt(curr.price.replace('¥', '')), 0)}</span>
                        </div>
                        <button 
                          onClick={() => alert('确认支付所有商品')}
                          className="w-full bg-blue-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-transform"
                        >
                          全选结算
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {secondaryPage === 'dynamics_list' && (
                <div className="absolute inset-0 flex flex-col bg-[#F7F8FA] overflow-y-auto no-scrollbar">
                  <div className="p-4 space-y-4">
                    {/* Top Business Card */}
                    <div className="bg-[#1C1F26] rounded-3xl p-5 shadow-xl relative overflow-hidden mb-5">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent blur-2xl" />
                      <div className="flex gap-4 items-center">
                        <div className="relative">
                          <img 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" 
                            className="w-16 h-16 rounded-3xl object-cover border-2 border-white/10" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg">地陪</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-white">李大明</h3>
                            <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded-md text-[10px] border border-green-500/20">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>已实名</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-400 mb-2">中国国旅 (贵州) 国际旅行社有限公司</p>
                          <div className="flex items-center gap-1.5 text-gray-300 pointer-events-auto" onClick={(e) => { e.stopPropagation(); window.location.href = 'tel:18585866935'; }}>
                            <Phone className="w-3 h-3 text-blue-400" />
                            <span className="text-xs font-medium">18585866935</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                      <h3 className="text-sm font-bold text-gray-900">所有动态</h3>
                    </div>

                    {/* Waterfall Grid */}
                    <div className="columns-2 gap-3 space-y-3 pb-20">
                      {dynamics.map(item => (
                        <div 
                          key={item.id}
                          onClick={() => {
                            setSelectedDynamic({ ...item, fromList: true });
                            setCurrentImgIndex(0);
                            setSecondaryPage('dynamic_detail');
                          }}
                          className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 active:scale-[0.98] transition-transform"
                        >
                          <div className="relative">
                            <img src={item.images[0]} alt={item.title} className="w-full h-auto object-cover" referrerPolicy="no-referrer" />
                            {item.isVideo && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                <div className="w-8 h-8 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                                  <motion.div 
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-white">
                              {item.images.length}P
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="text-[11px] font-bold text-gray-800 mb-2 line-clamp-2 leading-snug">{item.title}</h3>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-gray-400">{item.date}</span>
                              <div className="flex items-center gap-1 text-[9px] text-gray-400">
                                <Heart className="w-3 h-3" />
                                <span>{item.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {secondaryPage === 'dynamic_detail' && selectedDynamic && (
                <div className="absolute inset-0 flex flex-col bg-white overflow-hidden">
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    {/* Image Swiper / Video Container */}
                    <div className={`relative ${selectedDynamic.isVideo ? 'h-[600px]' : 'h-80'} group overflow-hidden`}>
                      {selectedDynamic.isVideo ? (
                        <div 
                          className="w-full h-full bg-black relative cursor-pointer"
                          onClick={() => setIsContentExpanded(false)}
                        >
                          <motion.img 
                            key={currentImgIndex}
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 1 }}
                            src={selectedDynamic.images[currentImgIndex]} 
                            className="w-full h-full object-cover opacity-60"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Expanded Text Overlay (Bottom Half, White Background) */}
                          <motion.div 
                            initial={false}
                            animate={{ 
                              height: isContentExpanded ? '50%' : '160px',
                              backgroundColor: isContentExpanded ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0)'
                            }}
                            className="absolute inset-x-0 bottom-0 z-20 transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {!isContentExpanded && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none" />
                            )}
                            
                            <div className={`relative z-30 p-6 h-full flex flex-col ${isContentExpanded ? 'text-gray-900' : 'text-white'}`}>
                              <h2 className={`text-lg font-bold mb-2 leading-tight ${isContentExpanded ? 'text-gray-900' : 'text-white'}`}>
                                {selectedDynamic.title}
                              </h2>
                              
                              <div className={`flex-1 overflow-y-auto no-scrollbar`}>
                                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${!isContentExpanded ? 'line-clamp-2 text-white/90' : 'text-gray-700'}`}>
                                  {selectedDynamic.content}
                                </p>
                              </div>

                              <button 
                                onClick={() => setIsContentExpanded(!isContentExpanded)}
                                className={`mt-3 text-xs font-bold flex items-center gap-0.5 self-start px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors ${
                                  isContentExpanded 
                                    ? 'bg-gray-100 text-blue-600' 
                                    : 'bg-white/10 text-blue-300'
                                }`}
                              >
                                {isContentExpanded ? '点击收起' : '展开全文'}
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isContentExpanded ? '-rotate-90' : 'rotate-90'}`} />
                              </button>
                            </div>
                          </motion.div>

                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-2 opacity-50"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <motion.img 
                          key={currentImgIndex}
                          initial={{ opacity: 0.8 }}
                          animate={{ opacity: 1 }}
                          src={selectedDynamic.images[currentImgIndex]} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      
                      {/* Image Indicators */}
                      {!isContentExpanded && selectedDynamic.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full">
                          {selectedDynamic.images.map((_, i) => (
                            <button 
                              key={i}
                              onClick={() => setCurrentImgIndex(i)}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImgIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Navigation Arrows */}
                      {selectedDynamic.images.length > 1 && (
                        <>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImgIndex(prev => (prev > 0 ? prev - 1 : selectedDynamic.images.length - 1));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImgIndex(prev => (prev < selectedDynamic.images.length - 1 ? prev + 1 : 0));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      {!selectedDynamic.isVideo && (
                        <>
                          <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-900">{selectedDynamic.title}</h2>
                          </div>
                          
                          <div className="bg-gray-100/30 rounded-2xl p-5 border border-gray-50 mb-2 relative">
                            <div className={`text-sm text-gray-700 leading-relaxed whitespace-pre-wrap transition-all duration-300 ${(!isContentExpanded && selectedDynamic.isVideo) ? 'line-clamp-2' : ''}`}>
                              {selectedDynamic.content}
                            </div>
                            {selectedDynamic.isVideo && selectedDynamic.content.length > 50 && (
                              <button 
                                onClick={() => setIsContentExpanded(!isContentExpanded)}
                                className="mt-2 text-blue-500 text-xs font-bold flex items-center gap-0.5"
                              >
                                {isContentExpanded ? '收起' : '展开全文'}
                                <ChevronRight className={`w-3 h-3 transition-transform ${isContentExpanded ? '-rotate-90' : 'rotate-90'}`} />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                      
                      <div className="text-[10px] text-gray-400 font-medium pt-2">发布于 {selectedDynamic.date}</div>
                      
                      <div className="mt-8 pb-32">
                        {/* Removed likes list */}
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Like Action */}
                  <button 
                    className="fixed right-6 bottom-10 z-[110] flex items-center gap-2 bg-white/20 backdrop-blur-md text-pink-500 px-5 py-4 rounded-3xl shadow-xl border border-white/10 active:scale-95 transition-transform"
                    onClick={() => {
                      if (selectedDynamic) {
                        setSelectedDynamic({ ...selectedDynamic, likes: selectedDynamic.likes + 1 });
                        
                        // +1 animation
                        const bubble = document.createElement('div');
                        bubble.innerText = '+1';
                        bubble.className = 'absolute -top-12 left-1/2 -translate-x-1/2 text-pink-500 font-bold text-lg pointer-events-none fade-out';
                        const container = document.getElementById('like-btn-inner');
                        if (container) container.appendChild(bubble);
                        setTimeout(() => bubble.remove(), 1000);
                      }
                    }}
                  >
                    <div id="like-btn-inner" className="relative flex items-center gap-2">
                      <Heart className="w-6 h-6 fill-pink-500" />
                      <span className="text-sm font-bold">{selectedDynamic.likes}</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Customizer Bottom Sheet */}
      <AnimatePresence>
        {showCustomizer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-end"
            onClick={() => setShowCustomizer(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full rounded-t-[32px] max-h-[90vh] overflow-y-auto no-scrollbar"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">AI 行程定制</h2>
                    <p className="text-xs text-gray-400 mt-1">告诉大明您的偏好，5秒生成专属方案</p>
                  </div>
                  <button onClick={() => setShowCustomizer(false)} className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                      手机号
                    </label>
                    <input 
                      type="tel"
                      placeholder="请填写您的手机号"
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm outline-none focus:border-blue-300 transition-colors font-mono"
                      value={aiConfig.phoneNumber}
                      onChange={(e) => setAiConfig({...aiConfig, phoneNumber: e.target.value})}
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                      游玩天数
                    </label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs outline-none"
                      value={aiConfig.duration}
                      onChange={(e) => setAiConfig({...aiConfig, duration: e.target.value})}
                    >
                      {[1,2,3,4,5,6,7].map(d => (
                        <option key={d} value={`${d}天`}>{d}天</option>
                      ))}
                    </select>
                  </div>

                  {/* Companions */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                      通行伙伴
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['独自出行', '家庭出行', '情侣出行', '朋友出行', '老人出行'].map(opt => (
                        <button 
                          key={opt}
                          onClick={() => setAiConfig({...aiConfig, companions: opt})}
                          className={`px-4 py-2 rounded-full text-[10px] font-medium border transition-all ${aiConfig.companions === opt ? 'bg-blue-500 border-blue-500 text-white shadow-md' : 'bg-white border-gray-100 text-gray-500'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                      风格偏好
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['文化体验', '经典必去', '自然风光', '城市景观', '历史古迹'].map(opt => (
                        <button 
                          key={opt}
                          onClick={() => setAiConfig({...aiConfig, style: opt})}
                          className={`px-4 py-2 rounded-full text-[10px] font-medium border transition-all ${aiConfig.style === opt ? 'bg-blue-500 border-blue-500 text-white shadow-md' : 'bg-white border-gray-100 text-gray-500'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={handleAiSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-2xl text-base font-bold shadow-xl active:scale-[0.98] transition-transform"
                  >
                    立即生成定制方案
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logic for Auto-scroll on Planning */}
      <AnimatePresence>
        {/* Removed planning overlay per user request */}
      </AnimatePresence>

      {/* Custom Styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
