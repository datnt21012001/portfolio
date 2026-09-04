/**
 * Vietnamese content, typed against `profile.ts` so the two cannot drift: add a
 * field there and this file stops compiling until it is answered here.
 *
 * Only prose is restated. Anything that is not language - an email address, a
 * phone number, a link, an icon slug, a product name, a measured number - is
 * spread in from the English module so there is exactly one place it can be
 * wrong. Technical terms stay in English because that is what Vietnamese
 * engineers actually say: index, query, endpoint, batch, worker, migration.
 */

import {
  person as personEn,
  featured as featuredEn,
  impact as impactEn,
  metrics as metricsEn,
  stack as stackEn,
  nav as navEn,
  ui as uiEn,
  hero as heroEn,
  runtimes as runtimesEn,
  howIWork as howIWorkEn,
  contact as contactEn,
  type ClientProject,
  type ImpactCase,
  type Job,
  type StackGroup,
} from './profile'

export type { ClientProject, ImpactCase, Job, StackGroup } from './profile'

/** Only the job title is language. Contact details are spread in. */
export const person = { ...personEn, role: 'Kỹ sư Backend', location: 'Đà Nẵng, Việt Nam' }

export const hero: typeof heroEn = {
  headline: 'Kỹ sư backend biến hệ thống chậm thành nhanh.',
  subtext:
    'Gần năm năm PHP và Laravel qua các hệ ERP, MES, y tế và thương mại điện tử, làm từ Đà Nẵng. Service ERP tôi đang phụ trách hiện tại chạy NestJS và Vue, và mọi kết quả tối ưu trên trang này đều ra từ đó.',
}

/** Numbers are spread in; only the caption under each one is translated. */
export const metrics = metricsEn.map((m, i) => ({
  ...m,
  label: [
    'PHP và Laravel, cộng một năm phụ trách một service NestJS',
    'Query báo cáo chậm nhất, sau khi viết lại',
    'Mỗi lần chạy migration CSV, trên Laravel',
    'Số ca ở trên nằm trong codebase NestJS',
  ][i]!,
}))

export const impact: ImpactCase[] = [
  {
    ...impactEn[0]!,
    title: 'Query tổng hợp quét năm triệu dòng',
    body: 'Bảng lưu mỗi ngày một dòng và phần tổng hợp đọc toàn bộ. Tôi thêm bảng rollup theo tháng, dồn dữ liệu ngày vào đó, rồi dựng lại composite index vốn sai thứ tự cột. Số dòng phải quét giảm từ năm triệu xuống 380.000.',
    context: 'Báo cáo ERP cho khách hàng, NestJS và TypeORM',
  },
  {
    ...impactEn[1]!,
    title: 'Bộ lọc nhiều cột không hề có index',
    body: 'Không có gì cao siêu ở đây. Tổ hợp điều kiện lọc không có gì để bám vào, và tìm ra được điều đó mới là toàn bộ công việc - thêm index chỉ mất vài phút. Không phải query chín giây nào cũng đang giấu một bài toán khó.',
    context: 'Màn hình danh sách ERP, NestJS',
  },
  {
    ...impactEn[2]!,
    title: 'Một LEFT JOIN qua mười tám bảng',
    body: 'Một endpoint join khoảng mười tám bảng, trong đó contacts 1 triệu dòng và contact info 2 triệu. Tôi tách nó ra: bản ghi chính trả về ngay, còn dữ liệu hợp đồng nặng hơn và ít cấp bách hơn ở lần render đầu thì tải sau. Hai endpoint còn lại trên màn hình đó đi từ 6,1s xuống 187ms và từ 8,8s xuống 6ms.',
    context: 'Luồng đọc CRM, NestJS',
  },
  {
    ...impactEn[3]!,
    before: 'không giới hạn',
    title: 'Batch job bóp nghẹt app server',
    body: 'Batch và app dùng chung một container, trên codebase kế thừa không có monitoring. Tôi tìm ra tranh chấp tài nguyên bằng docker stats, rồi tách batch sang worker riêng có giới hạn cứng, kèm cơ chế tự tiết chế đọc CPU của tiến trình Node trước khi nhận thêm việc.',
    context: 'Hạ tầng, Node.js',
  },
]

/** Job titles stay in English: that is how they are written on the CV and how
 *  Vietnamese recruiters read them. */
export const experience: Job[] = [
  {
    company: 'Bear Acer',
    role: 'Backend Developer',
    period: 'T8/2025 - nay',
    meta: 'Lập trình viên duy nhất của service ERP',
    points: [
      'Lập trình viên duy nhất của service ERP - NestJS với TypeORM ở server, Vue ở client - tổng hợp dữ liệu từ B2B và MES thành báo cáo ngày và tháng.',
      'Xử lý cả bốn vấn đề hiệu năng ở trên bên trong codebase NestJS mà tôi kế thừa, với một cấu trúc không tốt khi nó đến tay tôi.',
      'Thêm cảnh báo slow query cho một service vốn không có gì: query nào chậm hơn một giây đều được log lại và bắn về channel Discord của team, để một bước lùi hiệu năng đến tay tôi trước khi đến tay khách hàng.',
      'Nối hai stack lại với nhau: mỗi ngày B2B ghi dữ liệu nghiệp vụ vào một Postgres đồng bộ, sau đó mười hai batch job theo lịch và ba consumer RabbitMQ kéo sang rồi tính lại các bảng tổng hợp trong MySQL.',
      'Xây module billing cho MES: tính toán nhiều trường hợp, sinh hoá đơn PDF, gửi email nhiều người nhận, phân quyền theo vai trò. B2B và MES là phía PHP, và tôi cũng hỗ trợ cả hai.',
    ],
  },
  {
    company: 'Sotatek',
    role: 'Backend Developer',
    period: 'T3/2025 - T8/2025',
    meta: 'Đội 16 người, 5 người backend',
    points: [
      'Tham gia một hệ thống quản lý bệnh viện từ lúc khởi động, quyết định giải pháp kỹ thuật cùng kiến trúc và stack cho đội backend năm người.',
      'Thay việc release tuỳ hứng từ môi trường dev bằng feature branch cắt theo sprint tách ra từ main, để QC lập kế hoạch được theo sprint và chỉ những phần đã kiểm mới lên.',
      'Đưa vào checklist peer review, sau đó thêm một bước review PR có AI hỗ trợ để giảm chi phí review. Tôi cũng kèm hai bạn developer trong giai đoạn các bạn mới vào dự án.',
      'Tìm ra điểm nghẽn trong luồng đặt lịch khám: câu truy vấn tìm khung giờ trống, chạy qua lịch bác sĩ, ca trực và các lịch hẹn đã có, không có composite index nào để bám vào. Tôi đánh index cho nó và sắp xếp lại truy vấn theo đúng cách màn hình nạp dữ liệu, thay vì để nguyên một cú join.',
    ],
  },
  {
    company: 'Kozocom',
    role: 'Backend Developer, middle level',
    period: 'T2/2024 - T3/2025',
    meta: 'Đội 16 người',
    points: [
      'Nền tảng kho vận và tồn kho trên Laravel và PostgreSQL, làm trong đội Scrum, với một hàng đợi Redis gánh phần đồng bộ dữ liệu toàn hệ thống.',
      'Xây phần migration từ hệ cũ sang hệ mới: import CSV khoảng 2 đến 3 triệu bản ghi mỗi lần chạy, viết theo kiểu insert theo lô năm mươi dòng mỗi worker thay vì tạo một model cho từng dòng. Ở khối lượng đó, khác biệt không nằm ở tốc độ mà ở chỗ job có chạy xong nổi trước khi PHP hết bộ nhớ hay không.',
      'Sửa luôn các luồng đọc phía sau: eager load những quan hệ mà màn hình tồn kho vốn đang truy vấn từng dòng một - một ca N+1 kinh điển - và bỏ paginate() khỏi danh sách để nó thôi phải trả giá cho một câu COUNT trên toàn bảng ở mỗi request.',
      'Bổ sung feature test và unit test vào quy trình backend, đồng thời review code và hỗ trợ các bạn junior.',
    ],
  },
  {
    company: 'Flydino Technology',
    role: 'Junior Backend Developer',
    period: 'T4/2023 - T2/2024',
    meta: 'Nhiều dự án khách hàng',
    points: [
      'Làm backend trên Laravel và frontend trên Vue 3 với TypeScript cho ba nền tảng của khách hàng, tự thiết kế cấu trúc dữ liệu cho các tính năng mới.',
      'Tích hợp ChatGPT-4 vào luồng phân tích da: ảnh khuôn mặt người dùng tải lên được trả về thành một đánh giá tình trạng da, rồi đưa tiếp vào bước gợi ý sản phẩm.',
      'Tích hợp Keycloak SSO, đăng nhập SNS và lưu trữ S3 hoặc FTP trên một nền tảng tuyển dụng 18 người.',
    ],
  },
  {
    company: 'Nine Plus Software',
    role: 'Backend Developer, fresher to junior',
    period: 'T10/2021 - T4/2023',
    meta: 'Nơi bắt đầu',
    points: [
      'Được thăng từ fresher lên junior trong mười tám tháng, đi từ chỗ nhận task được giao sang chỗ tự ôm trọn một tính năng - schema, logic nghiệp vụ và API - với một senior review lại trước khi merge.',
      'Học Laravel và thiết kế REST API bằng cách làm tính năng thật trên một hệ thống quản lý nhân sự cho khách Nhật.',
      'Sau đó chuyển sang một nền tảng thương mại điện tử chạy Stripe: webhook có xác thực chữ ký và xử lý chống trùng khi Stripe gửi lại event, phần xử lý được đẩy vào queue để endpoint trả lời ngay, kèm luồng hoàn tiền, luồng thất bại và một job đối soát cho các đơn còn treo.',
    ],
  },
]

export const featured = {
  ...featuredEn,
  tagline: 'Tự bỏ tiền làm, đang trong giai đoạn thử nghiệm',
  body: 'Nền tảng bán hàng tại quầy và cửa hàng trực tuyến cho quán cà phê và hộ kinh doanh F&B nhỏ. Nó đang thử nghiệm chứ chưa ra mắt - phần pháp lý chưa xong - nhưng tôi trả tiền cho nó, tôi vận hành nó, và mọi quyết định kiến trúc trong đó là của tôi và tôi bảo vệ được.',
  points: [
    'Các service chia theo miền nghiệp vụ đứng sau một gateway Caddy: Laravel cho auth, admin, người dùng và thanh toán; Go với Gin cho cửa hàng và tồn kho; Python với FastAPI cho các tính năng AI.',
    'Postgres kèm PgBouncer, Redis và RabbitMQ, cùng một log worker gom sự kiện hoạt động thành các lần ghi COPY theo lô.',
    'Ba ứng dụng Vue 3 trong một workspace Bun, dùng Bun làm trình quản lý gói và bundler, kèm CI/CD trên GitHub Actions.',
    'Các service vẫn dùng chung một database. Đó là modular monolith, và ở quy mô này nó là đánh đổi có chủ ý chứ không phải sự cẩu thả.',
  ],
}

export const clientWork: ClientProject[] = [
  {
    name: 'Nền tảng ERP và MES cho B2B',
    period: 'T8/2025 - nay',
    client: 'Khách Nhật, service ERP do một mình tôi phụ trách',
    body: 'Hệ ERP và MES cho doanh nghiệp, phủ kế toán, CRM, nhân sự, billing, đơn hàng, giao vận và tồn kho. Tôi phụ trách service ERP; các hệ B2B và MES mà nó tổng hợp dữ liệu từ đó là PHP, và tôi hỗ trợ cả chúng.',
    stack: ['NestJS', 'TypeORM', 'Vue 3', 'MySQL', 'RabbitMQ'],
  },
  {
    name: 'Hệ thống quản lý bệnh viện',
    period: 'T3 - T8/2025',
    client: 'Khách Nhật, đội 16 người',
    body: 'Đặt lịch khám, quản lý khoá điều trị, ca trực và hợp đồng, với OAuth qua Laravel Passport và push notification.',
    stack: ['Lumen', 'Laravel', 'MySQL', 'Redis', 'FCM'],
  },
  {
    name: 'Nền tảng kho vận và tồn kho',
    period: 'T2/2024 - T3/2025',
    client: 'Khách Nhật, đội 16 người',
    body: 'Mua hàng, bán hàng và quản lý cửa hàng, cộng với phần migration CSV đưa toàn bộ dữ liệu cũ sang hệ mới.',
    stack: ['Laravel', 'PostgreSQL', 'Swagger', 'Pusher'],
  },
  {
    name: 'Thương mại điện tử và thanh toán',
    period: '2022 - 2025',
    client: 'Khách Nhật và Việt, 3 nền tảng',
    body: 'Gian hàng nhiều người bán, luồng đơn hàng và giao vận, một nền tảng bán kit xét nghiệm covid, và một nền tảng quản lý doanh nghiệp. Cả ba đều dùng Stripe, với Redis cache phần đọc danh mục.',
    stack: ['Laravel', 'MySQL', 'Stripe', 'Redis', 'Docker'],
  },
  {
    name: 'Phân tích da bằng AI và đặt lịch',
    period: 'T12/2023 - T2/2024',
    client: 'Khách Nhật, đội 8 người',
    body: 'ChatGPT-4 đọc ảnh khuôn mặt người dùng tải lên, trả về đánh giá tình trạng da, rồi đưa vào luồng gợi ý sản phẩm.',
    stack: ['Laravel', 'MySQL', 'OpenAI API'],
  },
  {
    name: 'Quản lý dự án và tuyển dụng',
    period: 'T6 - T12/2023',
    client: 'Khách Nhật, đội 18 người',
    body: 'Các module hợp đồng, dự án và công việc với phân quyền theo vai trò, Keycloak SSO, lưu trữ trên S3 và FTP.',
    stack: ['Laravel', 'Vue 3', 'TypeScript', 'MySQL', 'Keycloak'],
  },
  {
    name: 'Nền tảng đặt tài xế',
    period: 'T4 - T6/2023',
    client: 'Khách Việt, đội 8 người',
    body: 'Tính quãng đường và cước phí giữa điểm đón và điểm đến, đặt tài xế, đánh giá và quản lý.',
    stack: ['Laravel', 'Vue 3', 'TypeScript', 'Google Maps API'],
  },
]

/** Only the group label is language; every item name and icon slug is spread in. */
export const stack: StackGroup[] = stackEn.map((group, i) => ({
  ...group,
  label: ['Backend', 'Dữ liệu', 'Hạ tầng', 'Phía sản phẩm'][i]!,
}))

export const alsoUse: string =
  'Phía Node: TypeORM, class-validator, RabbitMQ qua @nestjs/microservices, @nestjs/schedule, Passport JWT, Vitest, Winston. Phía PHP: Lumen, Laravel Passport, Laravel Telescope, Laravel Reverb. Ngoài ra còn AWS S3, Firebase Cloud Messaging, Stripe, Keycloak, Pusher, Google Maps API.'

export const runtimes: typeof runtimesEn = {
  headline: 'Hai stack, và đường nối giữa chúng',
  intro:
    'PHP và Laravel là phần sâu: gần năm năm và bảy hệ thống chạy thật. NestJS là thứ tôi đang phụ trách, và mọi kết quả đo được ở trên đều ra từ đó. Cả hai đều là công việc hiện tại, và chỗ chúng gặp nhau là phần tôi muốn được hỏi nhất.',
  points: [
    {
      title: 'Laravel là phần sâu, và sâu gần năm năm',
      body: 'Bảy hệ thống chạy thật từ 2021 - nhân sự, thương mại điện tử và thanh toán, kho vận và tồn kho, đặt chỗ, tuyển dụng, và một nền tảng bệnh viện - trong các đội từ tám đến hai mươi hai người, phần lớn cho khách Nhật. Thiết kế schema, xử lý hàng đợi, kỷ luật review và cách đọc một câu query chậm đều là những thứ tôi học trong PHP trước khi viết dòng TypeScript nào. Đây không phải nửa CV tôi đang rời bỏ; đây là nửa đã dạy tôi phần còn lại.',
    },
    {
      title: 'Tôi đã phụ trách một service NestJS hơn một năm',
      body: 'Tôi là lập trình viên duy nhất trên đó: NestJS với TypeORM ở server, Vue ở client, kế thừa lại với một cấu trúc không tốt khi nó đến tay tôi. Đọc TypeScript của người khác trong lúc hệ thống đang tải và quyết định sửa cái gì mới là phần lớn công việc thật sự.',
    },
    {
      title: 'Cả bốn kết quả ở trên đều ra từ codebase NestJS',
      body: 'Service ERP là NestJS với TypeORM trên MySQL, cộng một datasource Postgres thứ hai cho dữ liệu đồng bộ. Bảng rollup, việc dựng lại index, việc tách endpoint và giới hạn cho batch worker đều được viết bằng TypeScript, không phải PHP. Node không phải ngôn ngữ tôi đang mong bước vào.',
    },
    {
      title: 'Hai stack gặp nhau ở một đường nối do tôi giữ',
      body: 'B2B và MES là PHP và tôi hỗ trợ cả hai. Mỗi ngày B2B ghi dữ liệu nghiệp vụ vào một Postgres đồng bộ; mười hai job theo lịch và ba consumer RabbitMQ sau đó kéo sang và tính lại các bảng tổng hợp bên phía ERP. Vận hành một hệ Laravel và một service NestJS đối chiếu nhau trong môi trường thật là việc hẹp hơn nhiều so với biết riêng từng stack.',
    },
    {
      title: 'Go là hướng đi, và tôi sẽ không nói quá lên',
      body: 'Go với Gin đang chạy các service cửa hàng, tồn kho và log worker trong MIA-POS, dự án riêng của tôi: Postgres sau PgBouncer, RabbitMQ, và một worker gom sự kiện hoạt động thành các lần ghi COPY theo lô. Đó là code tôi viết và tôi vận hành, nhưng nó cũng là một dự án phụ đang thử nghiệm chứ không phải thứ đang gánh lưu lượng thật. Hãy đọc nó như hướng tôi đang đi, không phải như stack thứ ba tôi dám nhận là có nhiều năm kinh nghiệm.',
    },
  ],
}

export const howIWork: typeof howIWorkEn = [
  {
    title: 'Đo trước, rồi mới động vào code',
    body: 'Việc tranh chấp CPU trên app server ERP được tìm ra bằng docker stats, không phải đoán. Báo cáo 26 giây được bấm giờ trên chính endpoint đang chạy và đối chiếu lại trong query log trước khi viết lại bất cứ dòng nào. Một bản sửa mà bạn không đo được là một bản sửa bạn không bảo vệ được.',
  },
  {
    title: 'Quy trình release là một phần của hệ thống',
    body: 'Ở Sotatek đội backend đang release từ một môi trường dev dùng chung, nên không có gì kiểm thử được một cách đáng tin. Chuyển sang feature branch cắt theo sprint tách từ main cho QC một thứ để lập kế hoạch, và không có gì lên production mà chưa đi qua QC.',
  },
  {
    title: 'Review nên tốn ít công của người review hơn',
    body: 'Tôi đưa vào một checklist peer review để việc review không còn là chuyện khẩu vị, rồi thêm một lượt AI đọc trước để bắt những thay đổi nằm ngoài phạm vi trước khi tới tay người thật.',
  },
]

export const contact: typeof contactEn = {
  headline: 'Sẵn sàng cho các vị trí backend Node.js và Laravel.',
  body: 'Remote, hybrid hoặc onsite tại Đà Nẵng. Nếu bạn có một service Node bỗng dưng chậm đi mà chưa ai chắc vì sao, đó chính là cuộc trò chuyện tôi muốn.',
}

/** href values are section anchors, not language. */
export const nav = navEn.map((item, i) => ({
  ...item,
  label: ['Kết quả', 'Hai stack', 'Kinh nghiệm', 'Dự án', 'Liên hệ'][i]!,
}))

export const ui: typeof uiEn = {
  downloadCv: 'Tải CV',
  getInTouch: 'Liên hệ',
  impactHeading: 'Những gì tôi thực sự đã thay đổi',
  impactIntro: 'Bốn vấn đề trong năm vừa rồi, kèm những con số ở đầu bên kia.',
  experienceHeading: 'Năm năm, năm đội',
  workHeading: 'Việc đã làm dưới tên người khác',
  workIntro:
    'Phần lớn nằm sau NDA, nên khách hàng không được nêu tên và để hệ thống tự nói thay.',
  stackHeading: 'Những thứ tôi hay dùng',
  alsoInUse: 'Cũng dùng thường xuyên.',
  howIWorkHeading: 'Cách tôi làm việc',
  credits:
    'Ảnh chân dung và ảnh chụp sản phẩm là của tôi. Ảnh toà nhà của Vinayak Sharma trên Unsplash.',
  portraitAlt: 'Nguyen Thanh Dat',
  featuredAlt: 'Trang chủ cửa hàng MIA-POS đang chạy thật',
  structureAlt: 'Hai toà nhà văn phòng nhìn từ đường phố, một ốp kính và một ốp đá',
}
