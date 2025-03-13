# アプリ名

ケイカくんアプリ

# アプリ概要

B 型事業所の計画支援において、利用者の計画支援のスケジュールを通知してくれるアプリ

# ペルソナ

B 型事業所に勤務するスタッフ

# 解決したい課題

個別支援計画のルーティンは通常 6 ヶ月だが、エクセルでそれらを管理していると非常に分かりづらい
問題点は、支援計画と利用者の個人情報を分散して管理していることで、情報にアクセスしづらくなっている
また、利用者ごとにファイルを作成しているため、いつが個別支援計画の期限なのかが分かりづらい

## 個別支援計画のルーティン

- 1 アセスメント
- 2 計画原案
- 3 担当者会議
- 4 本案
- 5 モニタリング
- 2〜5 を繰り返す
  1 初回のみ
  エクセルで管理・A さん個別支援計画 → シート 1 計画原案　シート 2

# 解決のアプローチ

個別支援計画の期限 1 ヶ月前までに通知が来るようにする(わかりやすい形で)　アプリ内＆メール
個別支援計画 2~5 を実施したらチェックマークがつき、完了したことがわかりやすくなる
利用者の情報を一つに集約し、1 つの画面で利用者全員の個別支援計画の期限が確認できるようにする

# 機能

- 認証機能(Email, Google) jwt 形式
- 利用者一覧表示(支援計画の期限表示)
- 利用者情報の追加、変更、削除
- 通知機能(支援計画の 1 か月前)　-> 誕生月と支援計画の期限が被っていた場合にもお知らせ
  - (メール通知機能)
- 検索：利用者の名前、疾病(フリーワード)期限 1 か月前、誕生月(絞り込み　この 2 つは or 検索)
- 並び替え：名前順　期限の残り少ない順
- 事業所を選択する(ユーザー:スタッフがどの事業所に所属しているか)
- 利用者の計画を手伝うプランナーの情報を表示
- (確認書類を共有する機能)
- (ユーザー同士でメッセージ送信)

# データ設計

User

```
id: int(PK)
email: text not null unique
password_hash: text not null
is_active: boolean default true
user_icon: text
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

AccessToken

```
id: int(PK)
user_id: int(FK=user.id)
token: text
is_active: boolean default=true
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

Message

```
id: int(PK)
sender_id: int(FK=user.id)
recipient_id: int(FK=user.id)
text: text
read: boolean
sent_at: datetime
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

ServiceRecipient

```　　
id: int(PK)
service_office_id: int(FK=service_office.id not null)
name:  text(30) not null
birthday: datetime
disease: text
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

UserServiceOffice

```
id: int(PK)
user_id: int(FK=user.id)
service_office_id: int(FK=service_office.id)
role: text
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

ServiceRecipientOffice

```
id: int(PK)
service_recipient_id: int(FK=service_recipient.id)
service_office_id: int(FK=service_office.id)
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

ServiceOffice

```
id: int(PK)
name: text
type: text
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

Notice

```
id: int(PK)
service_office_id: int(FK=service_office.id not null)
service_recipient_id: int(FK=service_recipient.id not null)
support_plan_id: int(FK=support_plan.id not null)  // 関連する支援計画を明示的に参照
message: text
notification_type: enum('deadline', 'birthday', 'both')  // birth_month_includedの代わり
deadline_date: datetime  // 期限日そのものを保存
is_read: boolean default false  // 既読状態を追跡
priority: int default 1  // 優先度（誕生月と重なる場合は高く設定）
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

UserNotificationSettings

```
id: int(PK)
user_id: int(FK=user.id)
email_notifications: boolean
deadline_advance_days: int
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

SupportPlanner

```
id: int(PK)
service_recipient_id: int(FK=service_recipient.id not null)
name: text
contact: text
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

SupportPlan

```
id: int(PK)
service_recipient_id: int(FK=service_recipient.id not null)
planning_start: datetime
plan_deadlines: datetime
assessment: boolean(default = false)
draft_plan: boolean(default = false) 　
meeting_of_managers: boolean(default = false)
this_plan: boolean(default = false)
monitoring: boolean(default = false)
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

SupportPlanStatus

```
id: int(PK)
support_plan_id: int(FK=support_plan.id)
step_type: enum('assessment', 'draft_plan', 'meeting_of_managers', 'this_plan', 'monitoring')
completed: boolean
completed_at: datetime
completed_by: int(FK=user.id)
notes: text
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

Deliverables

```
id: int(PK)
support_plan_id: int(FK=support_plan.id)
file_path: text
file_view: text
created_at: datetime default=datetime.jstnow
updated_at: datetime default=datetime.jstnow
```

erDiagram
User {
int id PK
text email
text password_hash
boolean is_active
text user_icon
datetime created_at
datetime updated_at
}

    AccessToken {
        int id PK
        int user_id FK
        text token
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    Message {
        int id PK
        int sender_id FK
        int recipient_id FK
        text text
        boolean read
        datetime sent_at
        datetime created_at
        datetime updated_at
    }

    ServiceRecipient {
        int id PK
        int service_office_id FK
        text name
        datetime birthday
        text disease
        datetime created_at
        datetime updated_at
    }

    UserServiceOffice {
        int id PK
        int user_id FK
        int service_office_id FK
        text role
        datetime created_at
        datetime updated_at
    }

    ServiceRecipientOffice {
        int id PK
        int service_recipient_id FK
        int service_office_id FK
        datetime created_at
        datetime updated_at
    }

    ServiceOffice {
        int id PK
        text name
        text type
        datetime created_at
        datetime updated_at
    }

    Notice {
        int id PK
        int service_office_id FK
        int service_recipient_id FK
        int support_plan_id FK
        text message
        enum notification_type
        datetime deadline_date
        boolean is_read
        int priority
        datetime created_at
        datetime updated_at
    }

    UserNotificationSettings {
        int id PK
        int user_id FK
        boolean email_notifications
        int deadline_advance_days
        datetime created_at
        datetime updated_at
    }

    SupportPlanner {
        int id PK
        int service_recipient_id FK
        text name
        text contact
        datetime created_at
        datetime updated_at
    }

    SupportPlan {
        int id PK
        int service_recipient_id FK
        datetime planning_start
        datetime plan_deadlines
        boolean assessment
        boolean draft_plan
        boolean meeting_of_managers
        boolean this_plan
        boolean monitoring
        datetime created_at
        datetime updated_at
    }

    SupportPlanStatus {
        int id PK
        int support_plan_id FK
        enum step_type
        boolean completed
        datetime completed_at
        int completed_by FK
        text notes
        datetime created_at
        datetime updated_at
    }

    Deliverables {
        int id PK
        int support_plan_id FK
        text file_path
        text file_view
        datetime created_at
        datetime updated_at
    }

    User ||--o{ AccessToken : "has"
    User ||--o{ Message : "sends"
    User ||--o{ UserNotificationSettings : "configures"
    User ||--o{ UserServiceOffice : "belongs to"
    User ||--o{ SupportPlanStatus : "completes"

    ServiceOffice ||--o{ UserServiceOffice : "employs"
    ServiceOffice ||--o{ ServiceRecipient : "manages"
    ServiceOffice ||--o{ ServiceRecipientOffice : "connects with"
    ServiceOffice ||--o{ Notice : "generates"

    ServiceRecipient ||--o{ ServiceRecipientOffice : "belongs to"
    ServiceRecipient ||--o{ SupportPlanner : "has"
    ServiceRecipient ||--o{ SupportPlan : "requires"
    ServiceRecipient ||--o{ Notice : "receives"

    SupportPlan ||--o{ SupportPlanStatus : "tracks progress with"
    SupportPlan ||--o{ Deliverables : "produces"
    SupportPlan ||--o{ Notice : "triggers"
