package models

type Todo struct {
	ID   string `bson:"_id,omitempty"` // Use omitempty to ignore empty ID fields
	Text string `bson:"text"`
}
