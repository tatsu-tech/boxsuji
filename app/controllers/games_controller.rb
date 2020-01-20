class GamesController < ApplicationController

  def index
  end

  def easy
    render 'play'
  end

  def normal
    render 'play'
  end

  def hard
    render 'play'
  end

  def new
    gon.question = Game.new(cell_params)
    render 'create'
  end

  def create
    gon.question = Game.new(create_params)
    gon.question.save
    redirect_to root_path , notice: 'Question created successfully.'
  end

  def show
  end

  private

  def cell_params
    params.permit(:cell)
  end

  def create_params
    params.permit(:cell, :xuji, :position)
  end

end