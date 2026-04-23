export interface Product {
  id: string;
  name: string;
  category: string;
  activeIngredient: string;
  purpose: string;
  treatment: string;
  skinType: string[];
  brand: string;
  size: string;
  price: number;
  imageUrl: string;
  productUrl: string;
  provider: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Hidratante Protini - Drunk Elephant",
    category: "Hidratante",
    activeIngredient: "Peptídeos",
    purpose: "Hidratante potente com complexo de peptídeos que ajuda a restaurar a firmeza e elasticidade da pele. Ideal para peles secas, promove hidratação intensa, deixando a pele mais saudável, macia e revitalizada. Tamanho: 50ml.",
    treatment: "Aplique de manhã e à noite sobre a pele limpa e seca para restaurar a barreira cutânea e combater a flacidez.",
    skinType: ["Pele Seca", "Todos os tipos"],
    brand: "Drunk Elephant",
    size: "50ml",
    price: 599.00,
    imageUrl: "https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dw2dc53531/images/hi-res-BR/Merchandising2%20-%20Skin/Drunk/856556004739/0_Protini%20Cream_PDP%20Asset_Standard.jpg?sw=556&sh=680&sm=fit",
    productUrl: "https://www.sephora.com.br/hidratante-facial-drunk-elephant-protini-polypeptide-cream-6556004739.html",
    provider: "Sephora"
  },
  {
    id: "2",
    name: "Gel de Limpeza - Jelly Cleanser",
    category: "Limpeza",
    activeIngredient: "Limpeza Média",
    purpose: "Gel de limpeza suave que remove impurezas e resíduos sem agredir a pele. Indicado para todos os tipos, proporciona uma limpeza equilibrada, mantendo a hidratação natural. Tamanho: 150ml.",
    treatment: "Use como o primeiro passo da sua rotina matinal e noturna para remover impurezas sem comprometer a hidratação.",
    skinType: ["Todos os tipos"],
    brand: "Drunk Elephant",
    size: "150ml",
    price: 279.00,
    imageUrl: "https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dw123ff7d7/images/hi-res-BR/Beste_Standard_01_3000px_300dpi_1500px.jpg?sw=1200&sh=1200&sm=fit",
    productUrl: "https://www.sephora.com.br/gel-de-limpeza-facial-drunk-elephant-beste-no-9-jelly-cleanser-6556004740.html",
    provider: "Sephora"
  },
  {
    id: "3",
    name: "C - Firma Fresh Day Serum",
    category: "Serum",
    activeIngredient: "Vitamina C",
    purpose: "Sérum com vitamina C que ajuda a uniformizar o tom da pele e melhorar a textura. Indicado para peles texturizadas, promove luminosidade e aparência mais firme. Tamanho: 28ml.",
    treatment: "Aplique pela manhã após a limpeza para proteger contra radicais livres e iluminar manchas de hiperpigmentação.",
    skinType: ["Pele Texturizada", "Todos os tipos"],
    brand: "Drunk Elephant",
    size: "28ml",
    price: 695.00,
    imageUrl: "https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dw54fd3d3b/images/hi-res-BR/Merchandising2%20-%20Skin/Drunk/812343034358/0_C-Firma_Fresh_30ml_Standards_01_5000px_300dpi.jpg?sw=1200&sh=1200&sm=fit",
    productUrl: "https://www.sephora.com.br/serum-facial-antioxidante-drunk-elephant-c-firma-fresh-day-serum-812343034358.html",
    provider: "Sephora"
  },
  {
    id: "4",
    name: "Pós Barba - Loccitane ",
    category: "Tratamento",
    activeIngredient: "Manteiga de Karité",
    purpose: "Tratamento calmante com manteiga de karité que hidrata e suaviza a pele após o barbear. Ideal para peles sensíveis, reduz irritações e vermelhidão. Tamanho: 75ml.",
    treatment: "Aplique imediatamente após o barbear para acalmar a pele e prevenir a foliculite e o ressecamento.",
    skinType: ["Pele Sensível"],
    brand: "Loccitane",
    size: "75ml",
    price: 249.00,
    imageUrl: "https://br.loccitane.com/dw/image/v2/BGNF_PRD/on/demandware.static/-/Sites-occ-br-master-catalog/default/dw853de588/PDP%20Content/Produtos/Cade/20AR075H22.2.png?sfrm=png",
    productUrl: "https://br.loccitane.com/pos-barba-cade-20AR075H22.html",
    provider: "Loccitane"
  },
  {
    id: "5",
    name: "The Daily Set - The Ordinary",
    category: "Kit",
    activeIngredient: "Cuidados Diários",
    purpose: "Kit completo para cuidados diários da pele. Indicado para todos os tipos, oferece uma rotina básica e eficiente para limpeza, tratamento e hidratação.",
    treatment: "Siga os três passos: limpeza suave, aplicação do sérum de tratamento e finalização com o hidratante para uma pele equilibrada.",
    skinType: ["Todos os tipos"],
    brand: "The Ordinary",
    size: "-",
    price: 215.00,
    imageUrl: "https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dw9219a0c4/images/hi-res-BR/Merchandising2%20-%20Skin/The%20Ordinary/769915233575/ORD-Product-Daily-Set-5200x5200-f03cb45-Photoroom.png?sw=400&sh=400&sm=fit",
    productUrl: "https://www.sephora.com.br/kit-de-cuidados-com-a-pele-the-ordinary-the-daily-set-769915233575.html",
    provider: "Sephora"
  },
  {
    id: "6",
    name: "Sérum Niacinamide + Zinc - The Ordinary",
    category: "Serum",
    activeIngredient: "Niacinamida",
    purpose: "Sérum que controla a oleosidade e ajuda a reduzir imperfeições. Ideal para peles oleosas, promove equilíbrio e melhora a aparência dos poros. Tamanho: 60ml.",
    treatment: "Aplique algumas gotas no rosto inteiro de manhã e à noite antes de cremes mais pesados para reduzir poros e acne.",
    skinType: ["Pele Oleosa"],
    brand: "The Ordinary",
    size: "60ml",
    price: 99.00,
    imageUrl: "https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dw9748ba50/images/hi-res-BR/Merchandising2%20-%20Skin/The%20Ordinary/769915195941/Niacinamide-10-+-Zinc-1%200.png?sw=1200&sh=1200&sm=fit",
    productUrl: "https://www.sephora.com.br/serum-facial-the-ordinary-niacinamide-10-zinc-1-769915195941.html",
    provider: "Sephora"
  },
  {
    id: "7",
    name: "Hidratante Labial Squalane - The Ordinary",
    category: "Hidratante Labial",
    activeIngredient: "Esqualano + Aminoácidos",
    purpose: "Hidratante labial com esqualano e aminoácidos que nutre profundamente os lábios. Indicado para lábios ressecados, proporciona maciez e hidratação prolongada. Tamanho: 15ml.",
    treatment: "Aplique generosamente nos lábios sempre que sentir ressecamento ou como máscara noturna para reparação intensa.",
    skinType: ["Pele Seca"],
    brand: "The Ordinary",
    size: "15ml",
    price: 75.00,
    imageUrl: "https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dw5e9757ea/images/hi-res-BR/Merchandising2%20-%20Skin/The%20Ordinary/769915233476/shop-rt-04254-01-squalane--amino-acids-lip-balm---15ml--2.jpg?sw=1200&sh=1200&sm=fit",
    productUrl: "https://www.sephora.com.br/hidratante-labial-the-ordinary-squalane-amino-acids-lip-balm-769915233476.html",
    provider: "Sephora"
  },
  {
    id: "8",
    name: "Hidratante PDRN Pink Collagen - Medicube",
    category: "Hidratante",
    activeIngredient: "PDRN",
    purpose: "Hidratante que promove firmeza e elasticidade da pele. Indicado para peles maduras, auxilia na regeneração e melhora o aspecto da pele. Tamanho: 55g.",
    treatment: "Massageie suavemente no rosto e pescoço em movimentos ascendentes para estimular a regeneração celular e firmeza.",
    skinType: ["Pele Madura"],
    brand: "Medicube",
    size: "55g",
    price: 319.99,
    imageUrl: "https://images.tcdn.com.br/img/img_prod/1118964/medicube_pdrn_pink_collagen_capsule_cream_creme_h_1_20251210130000_f5415dea641e.jpg",
    productUrl: "https://www.amokorea.com.br/medicube-pdrn-pink-collagen-capsule-cream-55ml",
    provider: "Araújo"
  },
  {
    id: "9",
    name: "Milk Toner - Medicube",
    category: "Tratamento",
    activeIngredient: "Niacinamida",
    purpose: "Tônico hidratante com niacinamida que ajuda a nutrir e equilibrar a pele. Ideal para peles maduras, proporciona hidratação leve e viço natural. Tamanho: 150ml.",
    treatment: "Aplique com as mãos pressionando levemente sobre a pele após a limpeza para restaurar o pH e hidratar profundamente.",
    skinType: ["Pele Madura"],
    brand: "Medicube",
    size: "150ml",
    price: 199.00,
    imageUrl: "https://images.tcdn.com.br/img/img_prod/1118964/medicube_age_r_glowy_milk_toner_tnico_hidratante_1_20251124111812_2e7435367af1.jpg",
    productUrl: "https://www.amokorea.com.br/medicube-age-r-glowy-milk-toner-150ml",
    provider: "Amo Korea CO"
  },
  {
    id: "10",
    name: "Zero Pore Pad - Medicube",
    category: "Tratamento",
    activeIngredient: "Ácido hialurônico",
    purpose: "Discos de tratamento que ajudam no controle da acne e na redução dos poros. Indicado para peles acneicas, promove limpeza profunda e hidratação com ácido hialurônico. Tamanho: 70un.",
    treatment: "Use o lado texturizado para esfoliar suavemente áreas com poros dilatados e o lado liso para hidratar e acalmar a acne.",
    skinType: ["Pele Acneica"],
    brand: "Medicube",
    size: "70un",
    price: 325.99,
    imageUrl: "https://images.tcdn.com.br/img/img_prod/1118964/medicube_zero_pore_pad_tnico_esfoliante_em_disco_1_20251201170128_652e0a6d3d38.jpg",
    productUrl: "https://www.amokorea.com.br/medicube-zero-pore-pad-2-0-70-discos",
    provider: "Araújo"
  },
  {
    id: "11",
    name: "Sérum Jelly - Medicube",
    category: "Tratamento",
    activeIngredient: "PDRN",
    purpose: "Sérum com PDRN que ilumina e revitaliza a pele. Ideal para peles secas, melhora o viço e proporciona aparência saudável. Tamanho: 100ml.",
    treatment: "Borrife ou aplique como sérum antes da maquiagem para um efeito 'glass skin' e hidratação duradoura em peles secas.",
    skinType: ["Pele Seca"],
    brand: "Medicube",
    size: "100ml",
    price: 229.00,
    imageUrl: "https://images.tcdn.com.br/img/img_prod/1118964/90_medicube_pink_pdrn_collagen_glow_serum_mist_bruma_1_20251217124259_5900b60139a2.jpg",
    productUrl: "https://www.amokorea.com.br/medicube-pdrn-pink-collagen-glow-serum-mist-100ml",
    provider: "Amo Korea CO"
  },
  {
    id: "12",
    name: "Protetor Solar FPS 45 - The Ordinary",
    category: "Proteção Solar",
    activeIngredient: "Filtros Solares",
    purpose: "Protetor solar que protege contra os danos causados pelos raios UV. Indicado para todos os tipos de pele, auxilia na prevenção do envelhecimento precoce. Tamanho: 60ml.",
    treatment: "Aplique generosamente 15 minutos antes da exposição solar e reaplique a cada 2 horas para prevenir manchas e rugas.",
    skinType: ["Todos os tipos"],
    brand: "The Ordinary",
    size: "60ml",
    price: 149.00,
    imageUrl: "https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dw7d095dbd/images/hi-res-BR/Merchandising2%20-%20Skin/The%20Ordinary/769915234084/769915234084_3.png?sw=1200&sh=1200&sm=fit",
    productUrl: "https://www.sephora.com.br/protetor-solar-facial-the-ordinary-mineral-uv-filters-spf-30-with-antioxidants-769915234084.html",
    provider: "Sephora"
  },
  {
    id: "13",
    name: "Cleasing Balm Slaai - Drunk Elephant",
    category: "Limpeza",
    activeIngredient: "Kiwi-Morango Semente",
    purpose: "Balm de limpeza que remove maquiagem e impurezas com eficácia. Indicado para todos os tipos de pele, proporciona limpeza profunda sem ressecar. Tamanho: 110ml.",
    treatment: "Massageie sobre a pele seca para derreter a maquiagem, depois adicione água para emulsionar e enxágue bem.",
    skinType: ["Todos os tipos"],
    brand: "Drunk Elephant",
    size: "110ml",
    price: 389.00,
    imageUrl: "https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dwe0b7fef6/images/hi-res-BR/Slaai_Standard_2000px_300dpi_1000px.jpg?sw=1200&sh=1200&sm=fit",
    productUrl: "https://www.sephora.com.br/balsamo-de-limpeza-facial-drunk-elephant-slaai-makeup-melting-butter-cleanser-6556004741.html",
    provider: "Sephora"
  },
  {
    id: "14",
    name: "Sérum Facial Antissinais - The Ordinary",
    category: "Tratamento",
    activeIngredient: "Fatores de crescimento",
    purpose: "Sérum com fatores de crescimento que ajuda a firmar e melhorar a aparência da pele. Indicado para peles maduras, combate sinais de envelhecimento. Tamanho: 30ml.",
    treatment: "Aplique à noite após a limpeza para potencializar a renovação celular e reduzir a profundidade das linhas de expressão.",
    skinType: ["Pele Madura"],
    brand: "The Ordinary",
    size: "30ml",
    price: 119.00,
    imageUrl: "https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dwb767a598/images/hi-res-BR/Merchandising2%20-%20Skin/The%20Ordinary/769915234411/769915234411_1.jpg?sw=1200&sh=1200&sm=fit",
    productUrl: "https://www.sephora.com.br/serum-facial-the-ordinary-multi-peptide-ha-serum-769915234411.html",
    provider: "Sephora"
  },
  {
    id: "15",
    name: "Óleo Facial - Drunk Elephant",
    category: "Tratamento",
    activeIngredient: "Virgin Marula",
    purpose: "Óleo nutritivo com marula que promove reparação intensa. Ideal para peles mistas, ajuda a restaurar a hidratação e o brilho natural da pele. Tamanho: 30ml.",
    treatment: "Misture 2-3 gotas no seu hidratante noturno para selar a hidratação e acalmar vermelhidões em peles mistas.",
    skinType: ["Pele Mista"],
    brand: "Drunk Elephant",
    size: "30ml",
    price: 599.00,
    imageUrl: "https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dw74db2e83/images/hi-res-BR/Merchandising2%20-%20Skin/Drunk/856556004821/0_Marula_30ml_Standard_2000px_300dpi_2019.08.28.jpg?sw=1200&sh=1200&sm=fit",
    productUrl: "https://www.sephora.com.br/oleo-facial-drunk-elephant-virgin-marula-luxury-facial-oil-6556004821.html",
    provider: "Sephora"
  },
  {
    id: "16",
    name: "Kit Minis - Drunk Elephant",
    category: "Kit",
    activeIngredient: "Cuidados Diários",
    purpose: "Kit com versões menores dos principais produtos da marca. Ideal para quem deseja testar uma rotina completa de cuidados com a pele.",
    treatment: "Use os produtos em conjunto conforme as instruções do kit para uma transformação completa da textura e saúde da pele.",
    skinType: ["Todos os tipos"],
    brand: "Drunk Elephant",
    size: "-",
    price: 799.00,
    imageUrl: "https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dwf04d2e05/images/hi-res-BR/PDPs/DrunkElephant/TheLittles/7/6-Littles%207.0%20AUS-INTL_Standard_04_3000px_1000px.jpg?sw=1200&sh=1200&sm=fit",
    productUrl: "https://www.sephora.com.br/kit-de-cuidados-com-a-pele-drunk-elephant-the-littles-7-0-6556006450.html",
    provider: "Sephora"
  }
];
