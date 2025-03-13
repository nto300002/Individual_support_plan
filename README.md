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

1 アセスメント 2 計画原案 3 担当者会議 4 本案 5 モニタリング 2〜5 を繰り返す
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
- 確認書類を共有する機能
- ユーザー同士でメッセージ送信

# データ設計

User

```
id: int(PK)
email: var not null unique
password_hash: var not null
is_active: boolean default true
user_icon: var
/created_at: datetime default=datetime.jstnow #共通、省略
/updated_at: datetime default=datetime.jstnow
```

AccessToken

```
id: int(PK)
user_id: int(FK=user.id)
token: var
is_active: boolean default=true
```

Message

```
id: int(PK)
user_id: var
text: var
```

ServiceRecipient

```　　
id: int(PK)
service_office_id: int(FK=service_office.id not null)
name:  var(30) not null
birthday: datetime
disease: var
```

ServiceOffice

```
id: int(PK)
user_id: int(FK=user.id)
service_recipient_id: int(FK=service_recipient.id)
name: var
type: var
```

Notice

```
id: int(PK)
service_office_id: int(FK=service_office.id not null)
service_recipient_id: int(FK=service_recipient.id not null)
message: var
birth_month_included: boolean
```

SupportPlanner

```
id: int(PK)
service_recipient_id: int(FK=service_recipient.id not null)
name: var
contact: var
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
```

Deliverables

```
id: int(PK)
support_plan_id: int(FK=support_plan.id)
file_path: var
file_view: var
```
