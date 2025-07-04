# Project ERD

The following ERD was made using [app.eraser.io diagram maker](https://app.eraser.io/)

## Script

```
// title
title YourShop Data Model

// define tables
admin {
  id string pk
  email string
  password string
  createdAt timestamp
  updatedAt timestamp
}

user  {
  id string pk
  name string
  email string unique
  password string
  verified boolean
  cartData object
  isGoogleAccount boolean
  createdAt timestamp
  updatedAt timestamp
}

order  {
  id string pk
  userId string fk
  items array
  amount number
  address object
  status string
  paymentMethod string
  payment boolean
  cancelled boolean
  date number
}

otp {
  id string pk
  email string
  otp string
  otpFor string
  verified boolean
  expiry date
}

product  {
  id string pk
  name string
  description string
  price number
  sellingPrice number
  image array
  category string
  subCategory string
  size array
  bestSeller boolean
  date number
}

review {
  id string pk
  productId string fk
  email string
  rating number
  comment string
  createdAt date
}

// define relationships
order.userId > user.id
review.productId > product.id
```

## Diagram

[View on Eraser![](https://app.eraser.io/workspace/qTuq4ldUqrpihQpGxU8x/preview?elements=yPniVPni-JMlctaqXI505Q&type=embed)](https://app.eraser.io/workspace/qTuq4ldUqrpihQpGxU8x?elements=yPniVPni-JMlctaqXI505Q)

<a href="[https://app.gleek.io/diagrams/1hurlKdEwlu_A8UrxRwwKg](https://app.eraser.io/workspace/qTuq4ldUqrpihQpGxU8x?origin=share)" target="_blank">
  <img src="[View on Eraser![](https://app.eraser.io/workspace/qTuq4ldUqrpihQpGxU8x/preview?elements=yPniVPni-JMlctaqXI505Q&type=embed)](https://app.eraser.io/workspace/qTuq4ldUqrpihQpGxU8x?elements=yPniVPni-JMlctaqXI505Q)" />
</a>
