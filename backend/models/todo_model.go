package models

type Todo struct {
	ID   string `bson:"id"`
	Text string `bson:"text"`
}
