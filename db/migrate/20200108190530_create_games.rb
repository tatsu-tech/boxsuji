class CreateGames < ActiveRecord::Migration[5.2]
  def change
    create_table :games do |t|
      t.string :name, null: false
      t.string :cell, null: false
      t.text :xuji, null: false
      t.text :position, null: false
      t.timestamps
    end
  end
end
